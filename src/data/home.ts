import type { ImageSourcePropType } from 'react-native';
import * as img from '../assets/images/home';

export interface ProductItem {
  id: string;
  image: ImageSourcePropType;
  title: string;
  weight: string;
  rating?: number;
  price: number;
  originalPrice: number;
  discountPercent: number;
  isAd?: boolean;
}

export interface CategoryTab {
  id: string;
  label: string;
  image: number;
}

export const categoryTabs: CategoryTab[] = [
  { id: 'foryou', label: 'For You', image: img.catForyou },
  { id: 'fresh', label: 'Fresh', image: img.catFresh },
  { id: 'grocery', label: 'Grocery', image: img.catGrocery },
  { id: 'electronics', label: 'Electronics', image: img.catElectronics },
  { id: 'beauty', label: 'Beauty', image: img.catBeauty },
  { id: 'monsoon', label: 'Monsoon', image: img.catMonsoon },
  { id: 'home', label: 'Home', image: img.catHome },
  { id: 'mobiles', label: 'Mobiles', image: img.catMobiles },
  { id: 'fashion', label: 'Fashion', image: img.catFashion },
  { id: 'dealzone', label: 'Deal Zone', image: img.catDealzone },
  { id: 'kids', label: 'Kids', image: img.catKids },
  { id: 'xtrasaver', label: 'XtraSaver', image: img.catXtrasaver },
  { id: 'healthcare', label: 'Healthcare', image: img.catHealthcare },
  { id: 'gifting', label: 'Gifting', image: img.catGifting },
  { id: 'paanstore', label: 'Paan store', image: img.catPaanstore },
];

export const featuredPicks = [
  img.featured1, img.featured2, img.featured3, img.featured4, img.featured5,
  img.featured6, img.featured7, img.featured8, img.featured9,
];

export interface CategoryLink {
  categoryId: string;
  subcategoryId?: string;
}

// Parallel to featuredPicks: Movie snacks!, New launch, What's cooking?, Breakfast spread,
// Smile please!, Sip & slurp, The organic zone, Chocolatey treats, Refresh it up!
export const featuredPickLinks: CategoryLink[] = [
  { categoryId: 'snacks', subcategoryId: 'chips-snacks' },
  { categoryId: 'snacks', subcategoryId: 'chips-snacks' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'dairy-breakfast' },
  { categoryId: 'personal-care', subcategoryId: 'oral-care' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'snacks', subcategoryId: 'chocolates' },
  { categoryId: 'snacks', subcategoryId: 'soft-drinks' },
];

export const topDeals: ProductItem[] = [
  { id: 'td1', image: img.deal1, title: 'Maggi 2-Minute Masala Instant Noodles', weight: '12 x 70 g', rating: 4.5, price: 162, originalPrice: 180, discountPercent: 10 },
  { id: 'td2', image: img.deal2, title: 'Pears Original Glycerin Soap Bar - Pure & Gentle Glow | With 98% Pure Glycerin', weight: '8 x 125 g', rating: 4.5, price: 500, originalPrice: 610, discountPercent: 18 },
  { id: 'td3', image: img.deal3, title: 'FORTUNE Chakki Fresh Atta', weight: '10 kg', rating: 4.4, price: 476, originalPrice: 485, discountPercent: 2 },
  { id: 'td4', image: img.deal4, title: 'Cadbury Celebrations Assorted Chocolate Bar Gift Pack', weight: '119.2 g', rating: 4.2, price: 116, originalPrice: 145, discountPercent: 20 },
  { id: 'td5', image: img.deal5, title: 'HORLICKS Nutrition Drink Plastic Container', weight: '1 kg', rating: 4.4, price: 471, originalPrice: 555, discountPercent: 15 },
  { id: 'td6', image: img.deal6, title: 'FORTUNE Chakki Fresh Atta', weight: '5 kg', rating: 4.4, price: 222, originalPrice: 253, discountPercent: 12 },
  { id: 'td7', image: img.deal7, title: 'FORTUNE Premium Kachi Ghani Pure Mustard Oil', weight: '1 L', rating: 4.4, price: 198, originalPrice: 225, discountPercent: 12 },
  { id: 'td8', image: img.deal8, title: 'Tata Tea Gold Gold Tea Pouch Black Tea Pouch', weight: '500 g', rating: 4.5, price: 271, originalPrice: 330, discountPercent: 18, isAd: true },
  { id: 'td9', image: img.deal9, title: 'DHARA Kachi Ghani Mustard Oil', weight: '1 L', rating: 4.4, price: 195, originalPrice: 250, discountPercent: 22 },
  { id: 'td10', image: img.deal10, title: 'AASHIRVAAD Shudh Chakki Atta', weight: '10 kg', rating: 4.5, price: 458, originalPrice: 499, discountPercent: 8 },
  { id: 'td11', image: img.deal11, title: 'Vim LIQUID POUCH Core Dish Cleaning Gel', weight: 'Lemon, 2 L', rating: 4.5, price: 349, originalPrice: 435, discountPercent: 20, isAd: true },
];

export const grabItems: ProductItem[] = [
  { id: 'gr1', image: img.grab1, title: 'Fried Gram', weight: '500 g', rating: 4.1, price: 67, originalPrice: 110, discountPercent: 39 },
  { id: 'gr2', image: img.grab2, title: 'Cadbury Hot Chocolate Drink Powder Mix', weight: '200 g', rating: 4.3, price: 243, originalPrice: 289, discountPercent: 16 },
  { id: 'gr3', image: img.grab3, title: 'Jeera / Cumin Seeds', weight: '200 g', price: 64, originalPrice: 100, discountPercent: 36 },
  { id: 'gr4', image: img.grab4, title: 'Peas', weight: '1 kg', price: 75, originalPrice: 180, discountPercent: 58 },
  { id: 'gr5', image: img.grab5, title: 'FROOTI Mango Juice', weight: '10 x 0.2 L', rating: 4.3, price: 162, originalPrice: 200, discountPercent: 19, isAd: true },
  { id: 'gr6', image: img.grab6, title: 'Indi Almonds', weight: '1 x 500 g', price: 461, originalPrice: 750, discountPercent: 39 },
  { id: 'gr7', image: img.grab7, title: 'Green Moong Dal (Split)', weight: '1 kg', rating: 4.2, price: 93, originalPrice: 260, discountPercent: 64 },
  { id: 'gr8', image: img.grab8, title: "Kellogg's Corn Flakes Real Almonds & Honey 1kg | Power Breakfast | 7 Vitamins Pouch", weight: '1000 g', rating: 4.5, price: 372, originalPrice: 540, discountPercent: 31, isAd: true },
  { id: 'gr9', image: img.grab9, title: 'Black Urad Dal (Split)', weight: '1 kg', rating: 4.3, price: 105, originalPrice: 220, discountPercent: 52 },
  { id: 'gr10', image: img.grab10, title: 'Lobia', weight: '500 g', rating: 4.1, price: 78, originalPrice: 95, discountPercent: 18 },
  { id: 'gr11', image: img.grab11, title: 'On1y Cinnamon Powder', weight: '45 g', price: 61, originalPrice: 139, discountPercent: 56, isAd: true },
  { id: 'gr12', image: img.grab12, title: 'Dhaniya / Coriander Seeds', weight: '400 g', rating: 4.2, price: 96, originalPrice: 140, discountPercent: 31 },
];

export const storeCards = [
  img.store1, img.store2, img.store3, img.store4, img.store5, img.store6, img.store7,
];

export const snackItems: ProductItem[] = [
  { id: 'sn1', image: img.snack1, title: 'Beyond Snack Kerala Banana Peri Peri Chips', weight: '75 g', rating: 4, price: 47, originalPrice: 60, discountPercent: 22 },
  { id: 'sn2', image: img.snack2, title: 'Sattviko Peri peri Roasted Makhana', weight: '52 g', rating: 4.3, price: 53, originalPrice: 130, discountPercent: 59 },
  { id: 'sn3', image: img.snack3, title: "The Baker's Dozen Protein Sour Cream & Onion Multigrain Chips", weight: '45 g', price: 33, originalPrice: 40, discountPercent: 18 },
  { id: 'sn4', image: img.snack4, title: '4700BC Cheese Popcorn, Jumbo Pack Cheese Popcorn', weight: '45 g', rating: 4.2, price: 42, originalPrice: 50, discountPercent: 16 },
  { id: 'sn5', image: img.snack5, title: '4700BC Salt And Truffle Corn Chips', weight: '55 g', price: 40, originalPrice: 50, discountPercent: 20, isAd: true },
  { id: 'sn6', image: img.snack6, title: 'Bikaji Mast Masala Chips', weight: '85 g', rating: 4.3, price: 26, originalPrice: 50, discountPercent: 48 },
  { id: 'sn7', image: img.snack7, title: 'pykd Bengaluru Congress Peanuts Namkeen', weight: '100 g', price: 65, originalPrice: 110, discountPercent: 41 },
  { id: 'sn8', image: img.snack8, title: 'pykd Desi Signature Mixture Namkeen', weight: '100 g', price: 80, originalPrice: 110, discountPercent: 27, isAd: true },
  { id: 'sn9', image: img.snack9, title: 'pykd Smoked Red Chilli Chips', weight: '100 g', price: 75, originalPrice: 130, discountPercent: 42 },
  { id: 'sn10', image: img.snack10, title: "Let's Try Party Mix", weight: '25 g', price: 14, originalPrice: 15, discountPercent: 7 },
  { id: 'sn11', image: img.snack11, title: "Let's Try Nendran Banana Chips", weight: '54 g', price: 29, originalPrice: 80, discountPercent: 64, isAd: true },
  { id: 'sn12', image: img.snack12, title: 'Sattviko Mint Roasted Makhana', weight: '52 g', rating: 4.3, price: 55, originalPrice: 130, discountPercent: 58 },
];

export const essentialTiles = [
  img.essential1, img.essential2, img.essential3, img.essential4,
  img.essential5, img.essential6, img.essential7, img.essential8,
];

// Parallel to essentialTiles: Atta & rice, Oil & ghee, Dal & pulses, Suji & flours,
// Spices & pickles, Tea & coffee, Dry fruits, Cereals & muesli
export const essentialTileLinks: CategoryLink[] = [
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'snacks', subcategoryId: 'tea-coffee' },
  { categoryId: 'grocery', subcategoryId: 'staples' },
  { categoryId: 'grocery', subcategoryId: 'dairy-breakfast' },
];

export const saverItems: ProductItem[] = [
  { id: 'sv1', image: img.saver1, title: 'Toor/Arhar Dal', weight: '500 g', rating: 4.2, price: 93, originalPrice: 140, discountPercent: 34 },
  { id: 'sv2', image: img.saver2, title: 'Peas', weight: '500 g', price: 45, originalPrice: 95, discountPercent: 53 },
  { id: 'sv3', image: img.saver1, title: 'Toor/Arhar Dal', weight: '1 kg', rating: 4.2, price: 149, originalPrice: 260, discountPercent: 43 },
  { id: 'sv4', image: img.saver3, title: 'Kabuli Chana', weight: '500 g', rating: 4.2, price: 55, originalPrice: 95, discountPercent: 42 },
  { id: 'sv5', image: img.saver3, title: 'Kabuli Chana', weight: '1 kg', rating: 4.2, price: 141, originalPrice: 180, discountPercent: 22 },
  { id: 'sv6', image: img.saver4, title: 'White Sugar', weight: '1 kg', price: 69, originalPrice: 90, discountPercent: 23 },
  { id: 'sv7', image: img.saver5, title: 'Suji', weight: '500 g', price: 25, originalPrice: 45, discountPercent: 44 },
  { id: 'sv8', image: img.saver6, title: 'Indian Raisins', weight: '1 x 500 g', price: 348, originalPrice: 410, discountPercent: 15 },
  { id: 'sv9', image: img.saver6, title: 'Indian Raisins', weight: '1 x 200 g', price: 114, originalPrice: 175, discountPercent: 35 },
  { id: 'sv10', image: img.saver7, title: 'Chana', weight: '1 kg', rating: 4.2, price: 90, originalPrice: 180, discountPercent: 50 },
];

export const promoTiles = [img.tile1, img.tile2, img.tile3];

export const rainyItems: ProductItem[] = [
  { id: 'ry1', image: img.rainy1, title: 'Classic Whole Cashews by Flipkart Grocery', weight: '1 x 200 g', rating: 4.1, price: 242, originalPrice: 290, discountPercent: 17 },
  { id: 'ry2', image: img.rainy2, title: 'Classic Independence Almonds by Flipkart Grocery', weight: '1 x 1 kg', price: 1255, originalPrice: 1380, discountPercent: 9 },
  { id: 'ry3', image: img.rainy3, title: 'Bolas Roasted & Salted Pistachios', weight: '1 x 200 g', rating: 4.1, price: 349, originalPrice: 475, discountPercent: 27 },
  { id: 'ry4', image: img.rainy4, title: 'ProV Select Cashew (Combo Pack, 2*200 g) (400 g) Cashews', weight: '2 x 200 g', rating: 4.1, price: 479, originalPrice: 698, discountPercent: 31 },
  { id: 'ry5', image: img.rainy5, title: 'ProV California Independence Almonds', weight: '2 x 250 g', rating: 4.2, price: 525, originalPrice: 678, discountPercent: 23 },
  { id: 'ry6', image: img.rainy6, title: 'ProV Select California Almonds Almonds', weight: '1 x 750 g', rating: 4, price: 978, originalPrice: 1060, discountPercent: 8 },
  { id: 'ry7', image: img.rainy7, title: 'Happilo Essentials Californian Popular Almonds', weight: '1 x 500 g', rating: 4.3, price: 673, originalPrice: 850, discountPercent: 21 },
  { id: 'ry8', image: img.rainy8, title: 'ProV Premium California Roasted and Salted Pistachios', weight: '2 x 250 g', rating: 4.3, price: 912, originalPrice: 1020, discountPercent: 11 },
  { id: 'ry9', image: img.rainy9, title: 'Scorist Popular Whole Cashews', weight: '1 x 1 kg', rating: 4.1, price: 1224, originalPrice: 1799, discountPercent: 32 },
];

export const banners = {
  topDeals: img.bannerTopdeals,
  promo1: img.banner1,
  promo2: img.banner2,
  promo3: img.banner3,
  footer: img.footer,
};
