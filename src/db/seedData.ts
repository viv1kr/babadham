import type { Product, CategoryInfo, Coupon, DevoteeReview } from '../types/ecommerce';

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'prasad',
    name: 'Baba Baidyanath Prasad',
    hindiName: 'बाबा बैद्यनाथ प्रसाद',
    slug: 'prasad',
    iconName: 'Sparkles',
    itemCount: 4,
    image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80',
    tagline: 'Blessed directly inside the Garbhagriha of Baidyanath Temple'
  },
  {
    id: 'peda',
    name: 'Deoghar Peda Prasad',
    hindiName: 'देवघर प्रसिद्ध पेड़ा',
    slug: 'peda',
    iconName: 'Gift',
    itemCount: 3,
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337cc?auto=format&fit=crop&w=800&q=80',
    tagline: 'Traditional pure milk khoya peda prepared in holy ghee'
  },
  {
    id: 'rudraksh',
    name: 'Rudraksh Collection',
    hindiName: 'रुद्राक्ष माला एवं ब्रेसलेट',
    slug: 'rudraksh',
    iconName: 'ShieldCheck',
    itemCount: 4,
    image: 'https://images.unsplash.com/photo-1621570074981-ee6a0145c8b5?auto=format&fit=crop&w=800&q=80',
    tagline: 'Lab-certified 100% natural Nepal 5-Mukhi & Sidh Rudraksh'
  },
  {
    id: 'kada',
    name: 'Panchdhatu Shiv Kada',
    hindiName: 'पंचधातु एवं चांदी कड़ा',
    slug: 'kada',
    iconName: 'Flame',
    itemCount: 2,
    image: 'https://images.unsplash.com/photo-1611591475179-42cd34264d64?auto=format&fit=crop&w=800&q=80',
    tagline: 'Embossed with Trishul & Mahamrityunjaya Mantra'
  },
  {
    id: 'gangajal',
    name: 'Sultanganj Gangajal',
    hindiName: 'उत्तरवाहिनी पवित्र गंगाजल',
    slug: 'gangajal',
    iconName: 'Droplet',
    itemCount: 2,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    tagline: 'Sacred Uttarvahini Ganga Jal directly from Sultanganj Ghat'
  },
  {
    id: 'combos',
    name: 'Mahadev Combo Kits',
    hindiName: 'महादेव सम्पूर्ण दिव्य किट',
    slug: 'combos',
    iconName: 'Crown',
    itemCount: 3,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    tagline: 'Grand devotional luxury boxes for family & festival gifting'
  }
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'bbp-001',
    name: 'Maha Shravani Temple Prasad Box (Garbhagriha Blessed)',
    hindiName: 'महा श्रावणी मंदिर गर्भगृह प्रसाद',
    category: 'prasad',
    categoryName: 'Baba Baidyanath Prasad',
    price: 551,
    originalPrice: 799,
    discountPercentage: 31,
    rating: 4.9,
    reviewCount: 482,
    image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599785209707-a456fc1337cc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'TEMPLE BLESSED',
    shortDesc: 'Pure Panchamrit Prasad, Dry Fruits, Elaichi Peda & sacred Belpatra offered directly to Bholenath Jyotirlinga.',
    fullDesc: 'Experience the divine grace of Baba Baidyanath Jyotirlinga. Every box contains fresh Elaichi Peda, Panchamrit Mishri, Kesar Dry Fruits, along with sacred Bhasma, Chandan, and Belpatra touch-offered at the main shrine in Deoghar.',
    templeBlessing: 'Chanted with Mahamrityunjaya Stotram by chief head pujaris of Baidyanath Dham before express dispatch.',
    weight: '500g Box',
    inStock: true,
    stockCount: 45,
    isBestSeller: true,
    isFeatured: true,
    purityGrade: 'A+ Grade Temple Standard',
    origin: 'Main Shinghasan Garbhagriha, Deoghar Temple Complex',
    sacredIngredients: ['Pure Desi Cow Ghee Peda', 'Kesar Panchamrit Mishri', 'Dry Fruits Box', 'Sacred Bhasma packet', 'Belpatra leaves'],
    usageGuidelines: 'Consume with pure heart. Keep Bhasma & Chandan in your home Mandir for daily tilak.'
  },
  {
    id: 'bbp-002',
    name: 'Authentic Pure Ghee Deoghar Peda (500g Pack)',
    hindiName: 'शुद्ध देशी घी देवघर पेड़ा (500 ग्राम)',
    category: 'peda',
    categoryName: 'Deoghar Peda Prasad',
    price: 499,
    originalPrice: 650,
    discountPercentage: 23,
    rating: 5.0,
    reviewCount: 934,
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337cc?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599785209707-a456fc1337cc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'BESTSELLER',
    shortDesc: 'Traditional caramelized milk khoya peda prepared using pure A2 Desi Cow ghee & cardamom.',
    fullDesc: 'World-famous Deoghar Peda. Handcrafted slow-cooked milk khoya blended with aromatic Green Cardamom (Elaichi) and pure ghee. Soft, melt-in-mouth texture with rich traditional flavor.',
    templeBlessing: 'Offered as Bhog during the daily Sandhya Aarti of Lord Baidyanath.',
    weight: '500 Grams Pack',
    inStock: true,
    stockCount: 120,
    isBestSeller: true,
    isFeatured: true,
    purityGrade: '100% Organic Milk Khoya',
    origin: 'Traditional Confectioners of Deoghar Dham',
    sacredIngredients: ['Pure Milk Khoya', 'A2 Desi Ghee', 'Organic Sugar', 'Idukki Green Cardamom'],
    usageGuidelines: 'Store in a cool dry place. Best consumed within 20 days of delivery.'
  },
  {
    id: 'bbp-003',
    name: 'Sidh 5-Mukhi Nepal Rudraksh Mala (108+1 Beads)',
    hindiName: 'सिद्ध 5-मुखी नेपाल रुद्राक्ष माला',
    category: 'rudraksh',
    categoryName: 'Rudraksh Collection',
    price: 1299,
    originalPrice: 1999,
    discountPercentage: 35,
    rating: 4.9,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1621570074981-ee6a0145c8b5?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621570074981-ee6a0145c8b5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611591475179-42cd34264d64?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'LAB CERTIFIED',
    shortDesc: 'Genuine 7mm-8mm Nepali Rudraksh beads energised with Om Namah Shivaya Japa.',
    fullDesc: 'Original 5-Mukhi Nepal Rudraksh Mala containing 108+1 Guru bead. Each bead is naturally contoured, dense, and tested for buoyancy & authenticity. Promotes inner tranquility, concentration, and spiritual protection.',
    templeBlessing: 'Pran Pratishtha energised on Monday inside Baba Baidyanath temple with Panchamrit Abhishekam.',
    weight: '45g',
    inStock: true,
    stockCount: 28,
    isBestSeller: false,
    isFeatured: true,
    purityGrade: '100% Natural Nepali (ISO Certified)',
    origin: 'High Altitude Himalayan Forests & Energised at Deoghar',
    sacredIngredients: ['Natural 5 Mukhi Nepal Rudraksh', 'Silk Thread Binding', 'Silver Plated Caps'],
    usageGuidelines: 'Wear around neck or use for daily mantra chanting. Avoid wearing while bathing with soap.'
  },
  {
    id: 'bbp-004',
    name: 'Trishul & Damru Embossed Silver Shiv Kada',
    hindiName: 'त्रिशूल एवं डमरू नक्काशीदार चाँदी कड़ा',
    category: 'kada',
    categoryName: 'Panchdhatu Shiv Kada',
    price: 2499,
    originalPrice: 3499,
    discountPercentage: 28,
    rating: 5.0,
    reviewCount: 189,
    image: 'https://images.unsplash.com/photo-1611591475179-42cd34264d64?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1611591475179-42cd34264d64?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'LUXURY JEWELRY',
    shortDesc: 'Solid Panchdhatu & 925 Sterling Silver casing embossed with sacred Shiv Trishul & Om.',
    fullDesc: 'A divine piece of wearable spiritual art. Heavy handcrafted Panchdhatu kada reinforced with 925 silver finish featuring intricate Trishul, Damru, and Mahamrityunjaya mantra engraving.',
    templeBlessing: 'Blessed against the Holy Jyotirlinga Sparsh.',
    weight: '75g',
    inStock: true,
    stockCount: 15,
    isBestSeller: true,
    isFeatured: true,
    purityGrade: '92.5% Pure Silver Overlay on Panchdhatu',
    origin: 'Master Craftsmen of Varanasi & Deoghar',
    usageGuidelines: 'Adjustable size fits all wrist sizes comfortably. Clean with soft velvet cloth.'
  },
  {
    id: 'bbp-005',
    name: 'Sultanganj Uttarvahini Ganga Jal Bottle (1 Litre Copper Vessel)',
    hindiName: 'सुल्तानगंज उत्तरवाहिनी पवित्र गंगाजल',
    category: 'gangajal',
    categoryName: 'Sultanganj Gangajal',
    price: 351,
    originalPrice: 500,
    discountPercentage: 30,
    rating: 4.9,
    reviewCount: 412,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'SACRED WATER',
    shortDesc: 'Pure North-flowing Ganga Jal collected from Ajgaibinath Dham Sultanganj, packaged in leak-proof copper-coated bottle.',
    fullDesc: 'The sacred water used for Kanwar Yatra. Collected from Uttarvahini Ganga at Sultanganj, the divine river flow dedicated to Lord Baidyanath. Completely natural, untouched, and crystal pure.',
    templeBlessing: 'Directly sourced from the holy ghats where millions of Kanwarias carry water to Deoghar.',
    weight: '1.2 kg (1 Litre)',
    inStock: true,
    stockCount: 80,
    isBestSeller: false,
    isFeatured: false,
    purityGrade: '100% Untouched Holy Water',
    origin: 'Uttarvahini Ganga River, Sultanganj, Bihar',
    usageGuidelines: 'Ideal for home Abhishekam, Pujas, festival rituals, and cleansing ceremonies.'
  },
  {
    id: 'bbp-006',
    name: 'Shravani Mela Divine Royal Combo Box',
    hindiName: 'श्रावणी मेला शाही दिव्य प्रसाद कॉम्बो',
    category: 'combos',
    categoryName: 'Mahadev Combo Kits',
    price: 1999,
    originalPrice: 2999,
    discountPercentage: 33,
    rating: 5.0,
    reviewCount: 560,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'ROYAL GIFT BOX',
    shortDesc: 'Includes 1kg Deoghar Peda, 5-Mukhi Rudraksh Bracelet, 500ml Gangajal, Bhasma & Brass Shiv idol.',
    fullDesc: 'The pinnacle of devotional luxury. Presented in an embossed velvet & golden foil box. Features 1kg fresh Peda, energised Rudraksh bracelet, Sultanganj Gangajal, original Deoghar Bhasma, brass mini Trishul & blessing certificate.',
    templeBlessing: 'Special Archana performed in devotee name at Deoghar Shinghasan.',
    weight: '2.5 kg Grand Box',
    inStock: true,
    stockCount: 20,
    isBestSeller: true,
    isFeatured: true,
    purityGrade: 'Premium Devotional Grade',
    origin: 'Baidyanath Temple Complex, Deoghar',
    sacredIngredients: ['1kg Pure Ghee Peda', 'Sidh Rudraksh Bracelet', '100% Pure Gangajal 500ml', 'Brass Trishul Idol', 'Authentic Bhasma'],
    usageGuidelines: 'Perfect luxury gift for family, weddings, housewarming, and festivals.'
  },
  {
    id: 'bbp-007',
    name: 'Original Nepali Rudraksh Bracelet with Silver Om Spacer',
    hindiName: 'नेपाली रुद्राक्ष कंगन ॐ पेंडेंट सहित',
    category: 'rudraksh',
    categoryName: 'Rudraksh Collection',
    price: 899,
    originalPrice: 1299,
    discountPercentage: 30,
    rating: 4.8,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1621570074981-ee6a0145c8b5?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621570074981-ee6a0145c8b5?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'POPULAR',
    shortDesc: 'Stretchable elastic Rudraksh bracelet handcrafted with 8mm natural beads & pure silver Om charm.',
    fullDesc: 'Elegant daily wear spiritual accessory. Hand-strung with genuine 5-Mukhi Nepal Rudraksh beads, separated by anti-tarnish silver spacers and an engraved Om symbol center bead.',
    templeBlessing: 'Energised with Rudrabhishek at Baidyanath Dham.',
    weight: '30g',
    inStock: true,
    stockCount: 50,
    isBestSeller: false,
    isFeatured: false,
    purityGrade: 'Natural & Certified Beads',
    origin: 'Nepal & Deoghar Shrine',
    usageGuidelines: 'Fits all wrist sizes. Ideal for daily confidence, positive energy, and peace of mind.'
  },
  {
    id: 'bbp-008',
    name: 'Akhand Jyot Temple Puja Kit',
    hindiName: 'अखंड ज्योति मंदिर पूजा किट',
    category: 'kits',
    categoryName: 'Temple Prasad Kits',
    price: 799,
    originalPrice: 1199,
    discountPercentage: 33,
    rating: 4.9,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'COMPLETE PUJA SET',
    shortDesc: 'Brass Diya, Organic Cow Ghee Wicks, Ashtagandha Chandan, Kesar Dhoop & Temple Prasad Packet.',
    fullDesc: 'Everything you need for an authentic temple-style Shiv Puja at your home. Includes handcrafted pure brass oil lamp, organic cow ghee batti, fragrant Ashtagandha paste, Kesar Incense sticks, and dry fruit prasad.',
    templeBlessing: 'Blessed inside Deoghar Temple Pujari Mandap.',
    weight: '850g Kit',
    inStock: true,
    stockCount: 35,
    isBestSeller: false,
    isFeatured: false,
    purityGrade: '100% Pure & Natural Puja Supplies',
    origin: 'Deoghar Temple Guild',
    usageGuidelines: 'Light the diya during morning & evening Aarti for positive vibrations.'
  }
];

export const COUPONS_DATA: Coupon[] = [
  {
    code: 'BAIDA10',
    discountPercent: 10,
    description: '10% instant discount on all sacred Prasad orders',
    minSpend: 499,
    maxDiscount: 200
  },
  {
    code: 'MAHADEV20',
    discountPercent: 20,
    description: '20% special blessing discount on orders above ₹1499',
    minSpend: 1499,
    maxDiscount: 500
  },
  {
    code: 'SHIVBABA',
    discountPercent: 15,
    description: '15% off on Rudraksh & Shiv Kada Collection',
    minSpend: 899,
    maxDiscount: 400
  }
];

export const DEVOTEE_REVIEWS: DevoteeReview[] = [
  {
    id: 'rev-1',
    devoteeName: 'Rajesh Sharma',
    location: 'New Delhi',
    rating: 5,
    date: '2 days ago',
    title: 'Pure Divine Taste & Super Fast Express Delivery!',
    comment: 'Receiving fresh Deoghar Peda in Delhi within 36 hours was unbelievable. The peda melted in the mouth and the smell of pure cow ghee was divine. The temple blessing certificate brought tears of joy to my mother.',
    verifiedPurchase: true,
    blessingTag: 'Verified Deoghar Devotee'
  },
  {
    id: 'rev-2',
    devoteeName: 'Sunita Mishra',
    location: 'Varanasi, UP',
    rating: 5,
    date: '1 week ago',
    title: 'Authentic Nepal Rudraksh Mala with Certificate',
    comment: 'Tested the 5-Mukhi Rudraksh mala in water and with lab magnifier — 100% original. The energy felt immediately during my morning Japa. Truly trustworthy service from Baidyanath Dham.',
    verifiedPurchase: true,
    blessingTag: 'Verified Purchase'
  },
  {
    id: 'rev-3',
    devoteeName: 'Amitabh Roy',
    location: 'Kolkata, WB',
    rating: 5,
    date: '3 weeks ago',
    title: 'Grand Shravani Combo Gift Box is Exceptional',
    comment: 'Gifted this combo box to my father-in-law on Mahashivratri. The golden packaging, the pure Sultanganj Gangajal, and authentic Bhasma are top notch. Pure Apple-like luxury with soul.',
    verifiedPurchase: true,
    blessingTag: 'Shravani Devotee'
  }
];
