export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: string;
  origin: string;
  roast: string;
  notes: string[];
  weight: string;
  image: string;
  rating: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    description: "Bright and floral with notes of jasmine and bergamot. A light roast that captures the essence of high-altitude Ethiopian terroir.",
    longDescription: "Grown at elevations above 1,900 meters in the Yirgacheffe region of Ethiopia, this single-origin coffee is washed-processed to highlight its delicate floral characteristics. The light roast preserves the natural complexity of the bean, revealing layers of jasmine, bergamot, and ripe stone fruit. Each sip unfolds like a garden in full bloom.",
    price: 22.50,
    category: "Single Origin",
    origin: "Ethiopia",
    roast: "Light",
    notes: ["Jasmine", "Bergamot", "Stone Fruit"],
    weight: "250g",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    rating: 4.9
  },
  {
    id: 2,
    name: "Colombian Supremo",
    description: "Rich and balanced with caramel sweetness, nutty undertones, and a smooth chocolate finish. A classic crowd-pleaser.",
    longDescription: "Sourced from the lush highlands of Huila, Colombia, this Supremo grade coffee represents the pinnacle of Colombian coffee craftsmanship. Medium-roasted to develop its natural caramel sweetness while maintaining bright acidity. The cup is full-bodied with lingering notes of dark chocolate and toasted almond.",
    price: 19.90,
    category: "Single Origin",
    origin: "Colombia",
    roast: "Medium",
    notes: ["Caramel", "Dark Chocolate", "Almond"],
    weight: "250g",
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop",
    rating: 4.7
  },
  {
    id: 3,
    name: "Velvet Espresso Blend",
    description: "A masterful blend designed for espresso. Bold, syrupy body with bittersweet chocolate and roasted hazelnut character.",
    longDescription: "Our signature espresso blend combines Brazilian Santos with Indonesian Sumatra for a cup that's impossibly smooth and rich. The dark roast develops deep caramelization while the careful blend ratio ensures perfect crema extraction. Ideal for milk-based drinks or enjoyed as a bold straight shot.",
    price: 18.50,
    category: "Blend",
    origin: "Brazil / Indonesia",
    roast: "Dark",
    notes: ["Dark Chocolate", "Hazelnut", "Molasses"],
    weight: "250g",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop",
    rating: 4.8
  },
  {
    id: 4,
    name: "Kenyan AA Peaberry",
    description: "Intensely vibrant with blackcurrant acidity, tomato-like savory notes, and a sparkling citrus finish. Extraordinary complexity.",
    longDescription: "Peaberry beans from Kenya's central highlands offer a rare and prized coffee experience. The single round bean concentrates flavor in a way that twin-bean cherries cannot match. This AA grade selection delivers explosive fruit-forward flavors with a wine-like complexity that evolves as the cup cools.",
    price: 26.00,
    category: "Single Origin",
    origin: "Kenya",
    roast: "Light-Medium",
    notes: ["Blackcurrant", "Grapefruit", "Tomato"],
    weight: "200g",
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop",
    rating: 4.6
  },
  {
    id: 5,
    name: "Morning Ritual Blend",
    description: "A smooth, approachable everyday blend. Balanced sweetness with milk chocolate and subtle berry notes. Perfect start to any day.",
    longDescription: "Crafted for consistency and comfort, our Morning Ritual blend brings together the best of Central American coffees. Guatemalan beans provide structure and sweetness, while Costa Rican naturals add fruity complexity. Medium-roasted for versatility — equally delightful as pour-over, drip, or French press.",
    price: 16.90,
    category: "Blend",
    origin: "Guatemala / Costa Rica",
    roast: "Medium",
    notes: ["Milk Chocolate", "Blueberry", "Honey"],
    weight: "340g",
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop",
    rating: 4.5
  },
  {
    id: 6,
    name: "Sumatra Mandheling",
    description: "Earthy and full-bodied with low acidity. Complex layers of cedar, dark cocoa, and dried fruit. A contemplative cup.",
    longDescription: "From the volcanic soils of North Sumatra, this wet-hulled (Giling Basah) processed coffee embodies the bold, earthy character that Indonesian coffees are celebrated for. The dark roast brings out deep, savory qualities while maintaining a surprising sweetness of dried dates and fig. A coffee for slow mornings and deep conversations.",
    price: 21.00,
    category: "Single Origin",
    origin: "Indonesia",
    roast: "Dark",
    notes: ["Cedar", "Dark Cocoa", "Dried Fig"],
    weight: "250g",
    image: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=400&fit=crop",
    rating: 4.7
  }
];

export const categories = ["All", "Single Origin", "Blend"];
export const roasts = ["All", "Light", "Light-Medium", "Medium", "Dark"];
