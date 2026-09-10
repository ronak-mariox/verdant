import * as img from '../assets/images/store';

export interface StoreProduct {
  id: string;
  image: number;
  title: string;
  weight: string;
  rating?: number;
  price: number;
  originalPrice: number;
  discountPercent: number;
  xtraSaverPrice?: number;
}

export interface KitchenTile {
  id: string;
  image: number;
  label: string;
}

export const kitchenTiles: KitchenTile[] = [
  { id: 'kt-ghee', image: img.tileGhee, label: 'Ghee' },
  { id: 'kt-oil', image: img.tileCookingOil, label: 'Cooking oil' },
  { id: 'kt-atta', image: img.tileAtta, label: 'Atta' },
  { id: 'kt-rice', image: img.tileRice, label: 'Rice' },
  { id: 'kt-daal', image: img.tileDaalPulses, label: 'Daal & pulses' },
  { id: 'kt-masala', image: img.tileMasalaSpices, label: 'Masala & spices' },
  { id: 'kt-sugar', image: img.tileSugarSalt, label: 'Sugar & salt' },
  { id: 'kt-dryfruits', image: img.tileDryFruits, label: 'Dry fruits' },
  { id: 'kt-suji', image: img.tileSujiRava, label: 'Suji, rava & more' },
];

export const giftPackings: StoreProduct[] = [
  { id: 'gp-1', image: img.productFarmleyCoffeeDateBites, title: 'Farmley Coffee Rush Date Bites', weight: '200 g', price: 345, originalPrice: 425, discountPercent: 0 },
  { id: 'gp-2', image: img.productFarmleyDateBitesAssorted, title: 'Farmley Date Bites (Almonds, Cashews, Dates, Pistachios)', weight: '200 g', price: 339, originalPrice: 400, discountPercent: 0 },
  { id: 'gp-3', image: img.productFarmleyChocoOrangeBarfi, title: 'Farmley Dark Choco-Orange Date Bites Barfi', weight: '200 g', rating: 4.3, price: 345, originalPrice: 425, discountPercent: 19 },
  { id: 'gp-4', image: img.productWonderlandGiftbox300g, title: 'WONDERLAND Premium Gift Box', weight: '300 g', price: 642, originalPrice: 1449, discountPercent: 56 },
  { id: 'gp-5', image: img.productWonderlandGiftbox180g, title: 'WONDERLAND Premium Gift Box', weight: '180 g', price: 294, originalPrice: 649, discountPercent: 55 },
  { id: 'gp-6', image: img.productHappiloDoveGiftbox, title: 'Happilo Dry Fruits Gift Box Dove Assorted Nuts', weight: '127 g', price: 263, originalPrice: 325, discountPercent: 19, xtraSaverPrice: 257 },
  { id: 'gp-7', image: img.productHappiloGoldenPotli, title: 'Happilo Dry Fruits Golden Potli', weight: '200 g', price: 335, originalPrice: 500, discountPercent: 33 },
  { id: 'gp-8', image: img.productTmiClassicGiftpack, title: 'Tmi Greetings Classic Gift Pack', weight: '225 g', price: 247, originalPrice: 350, discountPercent: 29 },
  { id: 'gp-9', image: img.productTmiDelightGiftpack, title: 'Tmi Greetings Delight Gift Pack', weight: '375 g', price: 373, originalPrice: 540, discountPercent: 31 },
];

export const bigPackSavings: StoreProduct[] = [
  { id: 'bp-1', image: img.productTataSampannToorDal2kg, title: 'Tata Sampann Unpolished Yellow Toor/Arhar Dal', weight: '2 kg', rating: 4.4, price: 339, originalPrice: 468, discountPercent: 28 },
  { id: 'bp-2', image: img.productTataSampannToorDal1kg, title: 'Tata Sampann Unpolished Yellow Toor/Arhar Dal', weight: '1 kg', rating: 4.4, price: 179, originalPrice: 234, discountPercent: 24 },
  { id: 'bp-3', image: img.productFortuneChakkiAtta5kg, title: 'FORTUNE Chakki Fresh Atta', weight: '5 kg', rating: 4.4, price: 222, originalPrice: 253, discountPercent: 12 },
  { id: 'bp-4', image: img.productAashirvaadChakkiAtta5kg, title: 'AASHIRVAAD Shudh Chakki Atta', weight: '5 kg', rating: 4.5, price: 237, originalPrice: 267, discountPercent: 11 },
  { id: 'bp-5', image: img.productRajdhaniChitraRajma1kg, title: 'Rajdhani Unpolished Chitra Rajma', weight: '1 kg', rating: 4.3, price: 179, originalPrice: 221, discountPercent: 19 },
  { id: 'bp-6', image: img.productRajdhaniKabuliChana1kg, title: 'Rajdhani Unpolished Kabuli Chana', weight: '1 kg', price: 129, originalPrice: 170, discountPercent: 24, xtraSaverPrice: 126 },
  { id: 'bp-7', image: img.productTataSampannKabuliChana1kg, title: 'Tata Sampann Unpolished Kabuli Chana', weight: '1 kg', rating: 4.3, price: 145, originalPrice: 168, discountPercent: 14 },
  { id: 'bp-8', image: img.productPillsburyChakkiAtta5kg, title: 'Pillsbury Chakki Fresh Atta', weight: '5 kg', rating: 4.3, price: 212, originalPrice: 264, discountPercent: 20 },
  { id: 'bp-9', image: img.productUttamRefinedSugar, title: 'UTTAM SUGAR Sulphurfree Refined Sugar', weight: '5 kg', rating: 4.4, price: 375, originalPrice: 420, discountPercent: 11 },
];

export const littleKirana: StoreProduct[] = [
  { id: 'lk-1', image: img.productFortuneMustardOil1l, title: 'FORTUNE Premium Kachi Ghani Pure Mustard Oil', weight: '1 L', rating: 4.4, price: 198, originalPrice: 230, discountPercent: 14 },
  { id: 'lk-2', image: img.productDharaMustardOil1l, title: 'DHARA Kachi Ghani Mustard Oil', weight: '1 L', rating: 4.4, price: 195, originalPrice: 250, discountPercent: 22 },
  { id: 'lk-3', image: img.productRajdhaniChitraRajma500g, title: 'Rajdhani Unpolished Chitra Rajma', weight: '500 g', rating: 4.3, price: 99, originalPrice: 127, discountPercent: 22, xtraSaverPrice: 97 },
  { id: 'lk-4', image: img.productRajdhaniPeas500g, title: 'Rajdhani Unpolished Peas', weight: '500 g', price: 48, originalPrice: 59, discountPercent: 19, xtraSaverPrice: 46 },
  { id: 'lk-5', image: img.productRajdhaniLobia500g, title: 'Rajdhani Unpolished Lobia', weight: '500 g', rating: 4.4, price: 74, originalPrice: 92, discountPercent: 20, xtraSaverPrice: 72 },
  { id: 'lk-6', image: img.productPansariMustardOil1l, title: 'Pansari Kacchi Ghani Mustard Oil', weight: '1 L', rating: 4.2, price: 196, originalPrice: 245, discountPercent: 20 },
  { id: 'lk-7', image: img.productFortuneBasmatiRice1kg, title: 'FORTUNE Rozana Gold Basmati Rice (Medium Grain)', weight: '1 kg', rating: 4.2, price: 91, originalPrice: 120, discountPercent: 24, xtraSaverPrice: 89 },
  { id: 'lk-8', image: img.productFortuneKabuliChana500g, title: 'FORTUNE Unpolished Kabuli Chana', weight: '500 g', rating: 4.2, price: 67, originalPrice: 85, discountPercent: 21, xtraSaverPrice: 66 },
  { id: 'lk-9', image: img.productRajdhaniKabuliChana500g, title: 'Rajdhani Unpolished Kabuli Chana', weight: '500 g', rating: 4.3, price: 67, originalPrice: 86, discountPercent: 22, xtraSaverPrice: 64 },
];

export const papadPickles: StoreProduct[] = [
  { id: 'pp-1', image: img.productChingsSchezwanChutney, title: "Ching's Secret Schezwan Chutney", weight: '250 g', rating: 4.3, price: 84, originalPrice: 90, discountPercent: 4 },
  { id: 'pp-2', image: img.productDelishSchezwanSauce, title: 'Delish Schezwan Hot and Spicy Sauce Chutney Paste', weight: '250 g', rating: 4.1, price: 49, originalPrice: 90, discountPercent: 46 },
  { id: 'pp-3', image: img.productBikanoMasalaPapad, title: 'Bikano Punjabi Masala Papad', weight: '200 g', price: 62, originalPrice: 75, discountPercent: 15 },
  { id: 'pp-4', image: img.productDelishAppalamPapad, title: 'Delish Appalam Papad', weight: '200 g', rating: 4.2, price: 45, originalPrice: 100, discountPercent: 54 },
  { id: 'pp-5', image: img.productHaldiramsBikaneriPapad, title: "Haldiram's Bikaneri Masala Papad", weight: '200 g', price: 64, originalPrice: 70, discountPercent: 7 },
  { id: 'pp-6', image: img.productDelishUradPapad, title: 'Delish Urad Papad', weight: '200 g', rating: 4.1, price: 46, originalPrice: 100, discountPercent: 53 },
  { id: 'pp-7', image: img.productLijjatUdad, title: 'Lijjat Udad', weight: '200 g', rating: 4.2, price: 76, originalPrice: 80, discountPercent: 4 },
  { id: 'pp-8', image: img.productKhetikaCoconutChutney, title: 'khetika Coconut Chutney Paste', weight: '120 g', price: 33, originalPrice: 49, discountPercent: 31 },
  { id: 'pp-9', image: img.productKissanHariChutney, title: 'Kissan Chatpati Hari Chutney Paste', weight: '200 g', price: 67, originalPrice: 90, discountPercent: 22 },
  { id: 'pp-10', image: img.productLijjatMasalaPapad, title: 'Lijjat Punjabi Masala Papad', weight: '250 g', rating: 4.5, price: 110, originalPrice: 115, discountPercent: 3 },
];

export const graviesPurees: StoreProduct[] = [
  { id: 'gv-1', image: img.productSuhanaPaneerButterMasala50g, title: 'SUHANA Paneer Butter Masala Mix', weight: '50 g', rating: 4.1, price: 45, originalPrice: 50, discountPercent: 10 },
  { id: 'gv-2', image: img.productZoffChickenChettinadMix, title: 'zoff Marinade Chicken Chettinad Mix', weight: '20 g', price: 35, originalPrice: 50, discountPercent: 30 },
  { id: 'gv-3', image: img.productKohinoorHyderabadiBiryaniKit, title: 'KOHINOOR Hyderabadi Biryani Kit', weight: '333 g', rating: 4.5, price: 110, originalPrice: 159, discountPercent: 31 },
  { id: 'gv-4', image: img.productSuhanaPaneerTikkaMasala, title: 'SUHANA Paneer Tikka Masala Mix', weight: '50 g', rating: 4.2, price: 45, originalPrice: 50, discountPercent: 10 },
  { id: 'gv-5', image: img.productZoffTandooriChickenMix, title: 'zoff Marinade Tandoori Chicken Mix', weight: '20 g', price: 25, originalPrice: 50, discountPercent: 50 },
  { id: 'gv-6', image: img.productZoffFishFryMix, title: 'zoff Marinade Fish Fry Mix', weight: '20 g', price: 35, originalPrice: 50, discountPercent: 30 },
  { id: 'gv-7', image: img.productSuhanaMutterPaneerMix, title: 'SUHANA Mutter Paneer Mix', weight: '50 g', rating: 4.4, price: 44, originalPrice: 50, discountPercent: 12 },
  { id: 'gv-8', image: img.productSuhanaVegBiryaniMix, title: 'SUHANA Veg Biryani Mix', weight: '50 g', price: 42, originalPrice: 50, discountPercent: 16 },
  { id: 'gv-9', image: img.productSuhanaPaneerMakhanwalaMix, title: 'SUHANA Paneer Makhanwala Mix', weight: '50 g', rating: 4.5, price: 44, originalPrice: 50, discountPercent: 12 },
  { id: 'gv-10', image: img.productSuhanaPaneerButterMasala100g, title: 'SUHANA Paneer Butter Masala Mix', weight: '100 g', rating: 4.4, price: 81, originalPrice: 100, discountPercent: 19, xtraSaverPrice: 79 },
];

export interface DalThumb {
  id: string;
  image: number;
  label: string;
}

export const dalThumbs: DalThumb[] = [
  { id: 'dal-1', image: img.thumbDal1, label: 'All Dals' },
  { id: 'dal-2', image: img.thumbMasoorDal, label: 'Masoor Dal' },
  { id: 'dal-3', image: img.thumbToorDal, label: 'Toor Dal' },
  { id: 'dal-4', image: img.thumbOthers, label: 'Others' },
  { id: 'dal-5', image: img.thumbUradDal, label: 'Urad Dal' },
  { id: 'dal-6', image: img.thumbDal6, label: 'Chana Dal' },
];

export interface BrandLogo {
  id: string;
  image: number;
  name: string;
}

export const brandLogos: BrandLogo[] = [
  { id: 'brand-happilo', image: img.brandHappilo, name: 'Happilo' },
  { id: 'brand-aashirvaad', image: img.brandAashirvaad, name: 'Aashirvaad' },
  { id: 'brand-daawat', image: img.brandDaawat, name: 'Daawat' },
  { id: 'brand-everest', image: img.brandEverest, name: 'Everest' },
  { id: 'brand-tatasampann', image: img.brandTataSampann, name: 'Tata Sampann' },
  { id: 'brand-fortune', image: img.brandFortune, name: 'Fortune' },
  { id: 'brand-catch', image: img.brandCatch, name: 'Catch' },
  { id: 'brand-zoff', image: img.brandZoff, name: 'Zoff' },
  { id: 'brand-saffola', image: img.brandSaffola, name: 'Saffola' },
];

export interface CrossSellTile {
  id: string;
  image: number;
  label: string;
}

export const crossSellTiles: CrossSellTile[] = [
  { id: 'cs-masala', image: img.tileMasalaStore, label: 'Masala store' },
  { id: 'cs-organic', image: img.tileOrganicStore, label: 'Organic store' },
];
