import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BackChevron,
  CartBadgeEllipse,
  CartIcon,
  ChevronBold,
  ChevronLink,
  ClockIcon,
  HeartOutline,
  MinusIcon,
  PlusIcon,
  ReplaceIcon,
  SearchLine,
  SeeAllArrow,
  ShareIcon,
  StarBold,
  StarIcon,
} from '../assets/icons/product';
import { brandIcon, seeAllThumb1, seeAllThumb2, seeAllThumb3 } from '../assets/images/product';
import { ProductDetailsAccordion, type ProductHighlight } from '../components/product/ProductDetailsAccordion';
import { SimilarProductCard } from '../components/product/SimilarProductCard';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import type { SimilarProduct, Variant } from '../data/product';
import type { AuthStackParamList } from '../navigation/types';
import { api } from '../services/api';
import { resolveProductImage } from '../utils/productImage';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProductDetail'>;

interface RawVariant {
  id: string;
  label: string;
  mrp: number;
  price: number;
  stock: number;
  sku?: string;
}

interface RawProduct {
  id: string;
  vendorId: string;
  categoryId: string;
  subcategoryId?: string;
  name: string;
  description?: string;
  brand?: string;
  unit?: string;
  images: string[];
  variants: RawVariant[];
  tags: string[];
  taxRate: number;
  status: string;
  isAvailable: boolean;
  sku?: string;
  barcode?: string;
  hsnCode?: string;
  countryOfOrigin?: string;
}

interface RatingSummary {
  avg: number;
  count: number;
}

interface ProductDetailResponse {
  product: RawProduct;
  similar: RawProduct[];
  rating: RatingSummary;
  isWishlisted: boolean;
}

/** Only surfaces attributes the product actually has set, instead of a fixed
 * template of fields that don't apply to every product (e.g. an FSSAI number
 * makes no sense on a t-shirt). */
function buildHighlights(product: RawProduct, variant?: { label: string }): ProductHighlight[] {
  const highlights: ProductHighlight[] = [];
  if (product.brand) highlights.push({ label: 'Brand', value: product.brand });
  const quantity = variant?.label ?? product.unit;
  if (quantity) highlights.push({ label: 'Quantity', value: quantity });
  if (product.sku) highlights.push({ label: 'SKU', value: product.sku });
  if (product.barcode) highlights.push({ label: 'Barcode', value: product.barcode });
  if (product.hsnCode) highlights.push({ label: 'HSN Code', value: product.hsnCode });
  if (product.countryOfOrigin) highlights.push({ label: 'Country of Origin', value: product.countryOfOrigin });
  return highlights;
}

function formatRatingCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return count.toLocaleString('en-IN');
}

function toSimilarDisplay(product: RawProduct): SimilarProduct {
  const variant = product.variants[0];
  const discountPercent =
    variant && variant.mrp > 0 ? Math.round(((variant.mrp - variant.price) / variant.mrp) * 100) : 0;
  return {
    id: product.id,
    image: resolveProductImage(product.images[0]),
    brand: product.brand ?? '',
    name: product.name,
    weight: product.unit ?? variant?.label ?? '',
    pricePerUnit: '',
    price: variant?.price ?? 0,
    mrp: variant?.mrp ?? 0,
    discountLabel: discountPercent > 0 ? `${discountPercent}% OFF on MRP` : '',
    rating: '★★★★☆',
    reviews: '',
    deliveryTime: '10 mins',
  };
}

export function ProductDetailScreen({ navigation, route }: Props) {
  const productId = route.params?.productId;
  const [data, setData] = useState<ProductDetailResponse | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { itemCount, items, addItem } = useCart();
  const { addressList, selectedAddressId } = useCheckout();
  const cartThumbItems = items.slice(0, 3);

  useEffect(() => {
    if (!productId) {
      setLoadError(true);
      return;
    }
    setData(null);
    setLoadError(false);
    setSelectedVariantId(null);
    setQuantity(1);
    api
      .get<ProductDetailResponse>(`/customer/products/${productId}`)
      .then(({ data }) => {
        setData(data);
        setSelectedVariantId(data.product.variants[0]?.id ?? null);
        setIsWishlisted(data.isWishlisted);
      })
      .catch(() => setLoadError(true));
  }, [productId]);

  const handleToggleWishlist = () => {
    if (!productId) return;
    setIsWishlisted((prev) => !prev);
    api.post<{ isWishlisted: boolean }>(`/customer/wishlist/${productId}/toggle`).catch(() => {
      // Revert the optimistic update if the request failed.
      setIsWishlisted((prev) => !prev);
    });
  };

  if (loadError) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.title}>Product not found</Text>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.viewDetailsText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color="#1CA672" size="large" />
      </View>
    );
  }

  const { product, similar, rating } = data;
  const variantData: Variant[] = product.variants;
  const selectedVariant = variantData.find((v) => v.id === selectedVariantId) ?? variantData[0];
  const discountPercent =
    selectedVariant && selectedVariant.mrp > 0
      ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
      : 0;
  const savings = selectedVariant ? selectedVariant.mrp - selectedVariant.price : 0;
  const heroImage = resolveProductImage(product.images[0]);
  const subtitle = product.description || [product.brand, selectedVariant?.label].filter(Boolean).join(' • ');
  const similarRow1 = similar.slice(0, 3).map(toSimilarDisplay);
  const similarRow2 = similar.slice(3, 6).map(toSimilarDisplay);
  const highlights = buildHighlights(product, selectedVariant);
  const deliveryAddress = addressList.find((a) => a.id === selectedAddressId) ?? addressList[0] ?? null;
  const deliveryAddressSummary = deliveryAddress
    ? { label: deliveryAddress.type.toUpperCase(), text: [deliveryAddress.line1, deliveryAddress.line2].filter(Boolean).join(', ') }
    : null;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product.id, selectedVariant.id, quantity);
  };

  const handleShare = () => {
    Share.share({
      message: `Check out ${product.name}${subtitle ? ` (${subtitle})` : ''} at ₹${selectedVariant?.price ?? ''} on Verdant!`,
    }).catch(() => {});
  };

  const openSimilarProduct = (productId: string) => {
    navigation.push('ProductDetail', { productId });
  };

  const addSimilarToCart = (id: string) => {
    const similarProduct = similar.find((p) => p.id === id);
    const variant = similarProduct?.variants[0];
    if (variant) addItem(id, variant.id);
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <BackChevron width={36} height={36} />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable
              style={[styles.iconCircle, isWishlisted && styles.iconCircleActive]}
              onPress={handleToggleWishlist}
              hitSlop={8}
            >
              <HeartOutline width={24} height={24} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Home')} hitSlop={8}>
              <SearchLine width={24} height={24} />
            </Pressable>
            <Pressable onPress={handleShare} hitSlop={8}>
              <ShareIcon width={24} height={24} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="contain" />
          {rating.count > 0 ? (
            <View style={styles.ratingBadge}>
              <StarBold width={16} height={16} />
              <Text style={styles.ratingBadgeText}>
                {rating.avg.toFixed(1)} <Text style={styles.ratingBadgeCount}>({formatRatingCount(rating.count)})</Text>
              </Text>
            </View>
          ) : null}
          <View style={styles.pageDots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.infoCard}>
            <View style={styles.chipsRow}>
              <View style={styles.deliveryBadge}>
                <ClockIcon width={14} height={14} />
                <Text style={styles.deliveryText}>10 mins</Text>
              </View>
              {rating.count > 0 ? (
                <View style={styles.ratingChip}>
                  <StarIcon width={14} height={14} />
                  <Text style={styles.ratingChipValue}>{rating.avg.toFixed(1)}</Text>
                  <Text style={styles.ratingChipCount}>({formatRatingCount(rating.count)})</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.title}>{product.name}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

            <View style={styles.priceRow}>
              <Text style={styles.price}>{`₹${selectedVariant?.price ?? 0}`}</Text>
              <Text style={styles.mrp}>{`₹${selectedVariant?.mrp ?? 0}`}</Text>
              {discountPercent > 0 ? (
                <View style={styles.discountPill}>
                  <Text style={styles.discountPillText}>{`${discountPercent}% OFF`}</Text>
                </View>
              ) : null}
            </View>
            {savings > 0 ? <Text style={styles.savings}>{`You save ₹${savings} on this item`}</Text> : null}

            <Text style={styles.sectionLabel}>Choose Variant</Text>
            <View style={styles.variantRow}>
              {variantData.map((variant) => {
                const active = variant.id === selectedVariant?.id;
                return (
                  <Pressable
                    key={variant.id}
                    onPress={() => setSelectedVariantId(variant.id)}
                    style={[styles.variantChip, active && styles.variantChipActive]}
                  >
                    <Text style={styles.variantLabel}>{variant.label}</Text>
                    <View style={styles.variantPriceRow}>
                      <Text style={styles.variantPrice}>{`₹${variant.price}`}</Text>
                      <Text style={styles.variantMrp}>
                        MRP <Text style={styles.variantMrpValue}>{`₹${variant.mrp}`}</Text>
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.quantityRow}>
              <View style={styles.quantityTextWrap}>
                <Text style={styles.sectionLabel}>Quantity</Text>
                <Text style={styles.stockText}>In stock • Ships from warehouse</Text>
              </View>
              <View style={styles.stepper}>
                <Pressable
                  style={styles.stepperButtonLight}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <MinusIcon width={16} height={16} />
                </Pressable>
                <Text style={styles.stepperValue}>{quantity}</Text>
                <Pressable style={styles.stepperButtonDark} onPress={() => setQuantity((q) => q + 1)}>
                  <PlusIcon width={16} height={16} />
                </Pressable>
              </View>
            </View>

            <Pressable
              style={styles.viewDetailsButton}
              onPress={() => setDetailsExpanded((v) => !v)}
            >
              <Text style={styles.viewDetailsText}>View product details</Text>
              <View style={detailsExpanded ? styles.chevronFlip : undefined}>
                <ChevronLink width={14} height={14} />
              </View>
            </Pressable>
          </View>

          {detailsExpanded ? (
            <ProductDetailsAccordion highlights={highlights} address={deliveryAddressSummary} rating={rating} />
          ) : null}

          <View style={styles.infoRow}>
            <View style={styles.infoRowLeft}>
              <View style={styles.brandIconWrap}>
                <Image source={brandIcon} style={styles.brandIconImage} resizeMode="contain" />
              </View>
              <View>
                <Text style={styles.infoRowTitle}>{product.brand || 'Brand'}</Text>
                <Text style={styles.infoRowSubtitle}>Explore all products</Text>
              </View>
            </View>
            <View style={styles.chevronRight}>
              <ChevronBold width={18} height={18} />
            </View>
          </View>

          <View style={styles.detailsTeaser}>
            <Text style={styles.detailsTeaserTitle}>{product.name}</Text>
            <View style={styles.detailsTeaserPill}>
              <Text style={styles.detailsTeaserPillText}>View Details</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoRowLeft}>
              <View style={styles.brandIconWrap}>
                <ReplaceIcon width={24} height={24} />
              </View>
              <Text style={styles.infoRowTitle}>72 hours only replacement</Text>
            </View>
            <View style={styles.chevronRight}>
              <ChevronBold width={18} height={18} />
            </View>
          </View>
        </View>

        <SimilarProductsBlock
          row1={similarRow1}
          row2={similarRow2}
          onSeeAll={() => navigation.navigate('Home')}
          onOpenItem={openSimilarProduct}
          onAddItem={addSimilarToCart}
        />
        <SeeAllProductPill onPress={() => navigation.navigate('Home')} />
        <SimilarProductsBlock
          row1={similarRow1}
          row2={similarRow2}
          onSeeAll={() => navigation.navigate('Home')}
          onOpenItem={openSimilarProduct}
          onAddItem={addSimilarToCart}
        />
        <SeeAllProductPill onPress={() => navigation.navigate('Home')} />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {itemCount > 0 ? (
        <Pressable style={styles.viewCartPill} onPress={() => navigation.navigate('Cart')}>
          <View style={styles.viewCartThumbs}>
            {cartThumbItems
              .map((item, index) => ({ item, index }))
              .reverse()
              .map(({ item, index }) => (
                <Image
                  key={item.id}
                  source={item.image}
                  style={[
                    styles.viewCartThumb,
                    index === 0 ? styles.viewCartThumb1 : index === 1 ? styles.viewCartThumb2 : styles.viewCartThumb3,
                  ]}
                />
              ))}
          </View>
          <Text style={styles.viewCartText}>View cart</Text>
          <View style={styles.viewCartIconWrap}>
            <CartIcon width={18} height={18} />
            <View style={styles.viewCartBadge}>
              <CartBadgeEllipse width={14} height={14} style={styles.viewCartBadgeEllipse} />
              <Text style={styles.viewCartBadgeText}>{itemCount}</Text>
            </View>
          </View>
        </Pressable>
      ) : null}

      <SafeAreaView edges={['bottom']} style={styles.stickyBarSafe}>
        <View style={styles.stickyBar}>
          <View>
            <View style={styles.stickyBadge}>
              <Text style={styles.stickyBadgeText}>{selectedVariant?.label ?? ''}</Text>
            </View>
            <View style={styles.stickyPriceRow}>
              <Text style={styles.stickyPrice}>{`₹${selectedVariant?.price ?? 0}`}</Text>
              <Text style={styles.stickyMrpLabel}>
                MRP <Text style={styles.stickyMrpValue}>{`₹${selectedVariant?.mrp ?? 0}`}</Text>
              </Text>
            </View>
            {discountPercent > 0 ? <Text style={styles.stickyOff}>{`${discountPercent}% Off`}</Text> : null}
          </View>
          <Pressable style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to cart</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SimilarProductsRow({
  data,
  onOpenItem,
  onAddItem,
}: {
  data: SimilarProduct[];
  onOpenItem: (productId: string) => void;
  onAddItem: (id: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarList}>
      {data.map((item) => (
        <SimilarProductCard
          key={item.id}
          item={item}
          onPress={() => onOpenItem(item.id)}
          onAdd={() => onAddItem(item.id)}
        />
      ))}
    </ScrollView>
  );
}

function SimilarProductsBlock({
  row1,
  row2,
  onSeeAll,
  onOpenItem,
  onAddItem,
}: {
  row1: SimilarProduct[];
  row2: SimilarProduct[];
  onSeeAll: () => void;
  onOpenItem: (productId: string) => void;
  onAddItem: (id: string) => void;
}) {
  return (
    <View style={styles.similarSection}>
      <View style={styles.similarHeader}>
        <Text style={styles.similarTitle}>Similar products</Text>
        <Pressable onPress={onSeeAll}>
          <Text style={styles.similarSeeAll}>See all</Text>
        </Pressable>
      </View>
      <SimilarProductsRow data={row1} onOpenItem={onOpenItem} onAddItem={onAddItem} />
      <SimilarProductsRow data={row2} onOpenItem={onOpenItem} onAddItem={onAddItem} />
    </View>
  );
}

function SeeAllProductPill({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.seeAllWrap}>
      <Pressable style={styles.seeAllPill} onPress={onPress}>
        <View style={styles.seeAllThumbs}>
          <Image source={seeAllThumb3} style={[styles.seeAllThumb, styles.seeAllThumb3]} />
          <Image source={seeAllThumb2} style={[styles.seeAllThumb, styles.seeAllThumb2]} />
          <Image source={seeAllThumb1} style={[styles.seeAllThumb, styles.seeAllThumb1]} />
        </View>
        <Text style={styles.seeAllText}>See all Product</Text>
        <SeeAllArrow width={6} height={10} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  headerSafe: { backgroundColor: '#FFFFFF' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  iconCircle: {
    borderRadius: 999,
  },
  iconCircleActive: {
    backgroundColor: '#FFF1F2',
  },
  heroWrap: {
    height: 229,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 200,
    height: 200,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 10,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  ratingBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1CA672',
  },
  ratingBadgeCount: {
    color: '#5F5F5F',
  },
  pageDots: {
    position: 'absolute',
    bottom: 17,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 16,
    backgroundColor: '#1CA672',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deliveryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingChipValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E2939',
  },
  ratingChipCount: {
    fontSize: 12,
    color: '#6A7282',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    paddingTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6A7282',
    paddingTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
  },
  price: {
    fontSize: 30,
    fontWeight: '700',
    color: '#101828',
  },
  mrp: {
    fontSize: 16,
    color: '#99A1AF',
    textDecorationLine: 'line-through',
  },
  discountPill: {
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  discountPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  savings: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1CA672',
    paddingTop: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#364153',
  },
  variantRow: {
    flexDirection: 'row',
    gap: 15,
    paddingTop: 8,
  },
  variantChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  variantChipActive: {
    backgroundColor: '#F3FFF8',
    borderColor: '#1CA672',
  },
  variantLabel: {
    fontSize: 13,
    color: '#5F5F5F',
  },
  variantPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    flexWrap: 'wrap',
  },
  variantPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  variantMrp: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  variantMrpValue: {
    textDecorationLine: 'line-through',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  quantityTextWrap: {
    flex: 1,
  },
  stockText: {
    fontSize: 12,
    color: '#6A7282',
    paddingTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    width: 118,
    borderWidth: 1,
    borderColor: '#1CA672',
    borderRadius: 12,
    overflow: 'hidden',
  },
  stepperButtonLight: {
    width: 40,
    height: '100%',
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonDark: {
    width: 40,
    height: '100%',
    backgroundColor: '#1CA672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#1E2939',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 16,
    paddingBottom: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1CA672',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 10,
  },
  chevronRight: {
    transform: [{ rotate: '90deg' }],
  },
  chevronFlip: {
    transform: [{ rotate: '180deg' }],
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  brandIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 9,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconImage: {
    width: 40,
    height: 24,
  },
  infoRowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  infoRowSubtitle: {
    fontSize: 12,
    color: '#5F5F5F',
    paddingTop: 4,
  },
  detailsTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.2,
    borderColor: '#E5E7EB',
    borderRadius: 15,
    padding: 12,
  },
  detailsTeaserTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  detailsTeaserPill: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderWidth: 0.5,
    borderColor: '#1CA672',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  detailsTeaserPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1CA672',
  },
  similarSection: {
    paddingTop: 12,
  },
  similarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  similarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  similarSeeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1CA672',
  },
  similarList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  seeAllWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  seeAllPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    height: 56,
    backgroundColor: 'rgba(28,166,114,0.1)',
    borderRadius: 12,
  },
  seeAllThumbs: {
    flexDirection: 'row',
  },
  seeAllThumb: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  seeAllThumb1: {
    marginLeft: 0,
    zIndex: 3,
  },
  seeAllThumb2: {
    marginLeft: -18,
    zIndex: 2,
  },
  seeAllThumb3: {
    marginLeft: -18,
    zIndex: 1,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1CA672',
  },
  bottomSpacer: {
    height: 24,
  },
  viewCartPill: {
    position: 'absolute',
    bottom: 84,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1CA672',
    borderRadius: 30,
    paddingLeft: 5,
    paddingRight: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  viewCartThumbs: {
    flexDirection: 'row',
  },
  viewCartThumb: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  viewCartThumb1: {
    marginLeft: 0,
    zIndex: 3,
  },
  viewCartThumb2: {
    marginLeft: -13,
    zIndex: 2,
  },
  viewCartThumb3: {
    marginLeft: -13,
    zIndex: 1,
  },
  viewCartText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F5F5F7',
  },
  viewCartIconWrap: {
    width: 26,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCartBadgeEllipse: {
    position: 'absolute',
  },
  viewCartBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1CA672',
  },
  stickyBarSafe: {
    backgroundColor: '#FFFFFF',
  },
  stickyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  stickyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F4FFF8',
    borderWidth: 0.5,
    borderColor: '#1CA672',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stickyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1CA672',
  },
  stickyPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
  },
  stickyPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  stickyMrpLabel: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  stickyMrpValue: {
    textDecorationLine: 'line-through',
  },
  stickyOff: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1CA672',
    paddingTop: 2,
  },
  addToCartButton: {
    backgroundColor: '#1CA672',
    height: 48,
    width: 121,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
