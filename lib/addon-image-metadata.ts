// INTERNAL USE ONLY — Never import in pages, components or APIs
// This file is for the developer image-generation workflow only

export interface AddonImageMeta {
  id: string;
  image_path: string;
  image_generation_status: 'pending' | 'generating' | 'completed' | 'failed';
  image_generation_prompt: string;
}

export const ADDON_IMAGE_METADATA: AddonImageMeta[] = [
  // ── CAKES ──
  {
    id: 'addon-truffle-cake',
    image_path: '/images/addons/cakes/truffle-cake.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a 500gm Eggless Chocolate Truffle Cake. A round, single-tier eggless cake approximately 15cm diameter, covered smoothly in deep dark chocolate ganache, with delicate chocolate shavings and truffle pearls on top, matte-black sponge visible at the cut edge. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-butterscotch-cake',
    image_path: '/images/addons/cakes/butterscotch-cake.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a 500gm Butterscotch Crunch Cake. A round, single-tier cake approximately 15cm diameter, frosted in pale golden butterscotch cream, studded with caramel praline crunch pieces on top and sides, with a small cascade of golden caramel drizzle. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-strawberry-cake',
    image_path: '/images/addons/cakes/strawberry-cake.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a 500gm Strawberry Glaze Cake. A round, single-tier cake approximately 15cm diameter, frosted in pale pink whipped cream, topped with fresh glossy red strawberry slices fanned elegantly, with a light strawberry glaze drizzle. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-black-forest-cake',
    image_path: '/images/addons/cakes/black-forest-cake.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a 500gm Black Forest Cake. A round, single-tier cake approximately 15cm diameter, frosted in fluffy white whipped cream, decorated with dark chocolate shavings on the sides, topped with whole glacé cherries and a dusting of dark cocoa powder. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-red-velvet-cake',
    image_path: '/images/addons/cakes/red-velvet-cake.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a 500gm Red Velvet Cake. A round, single-tier cake approximately 15cm diameter, with a deep crimson-red sponge visible at a cut slice, smooth ivory cream cheese frosting on the exterior, with delicate red velvet cake crumbs dusted on top. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-choc-fudge-cake',
    image_path: '/images/addons/cakes/chocolate-fudge-cake.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a 500gm Chocolate Fudge Cake. A round, single-tier cake approximately 15cm diameter, covered in a thick glossy dark chocolate fudge frosting with gentle swirls on top, dripping ganache sides, and scattered mini chocolate chips. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-white-forest-cake',
    image_path: '/images/addons/cakes/white-forest-cake.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a 500gm White Forest Cake. A round, single-tier cake approximately 15cm diameter, frosted in pure white whipped cream, decorated with white chocolate shavings, topped with glazed maraschino cherries and a light dusting of powdered sugar. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-bento-cake',
    image_path: '/images/addons/cakes/bento-cake.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Bento Cake (250gm single-serve). A tiny square lunchbox-style mini cake approximately 8x8cm, frosted in pastel cream with minimal elegant piping, presented in a small kraft paper bento box with a lid slightly ajar to reveal the cake. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },

  // ── CHOCOLATES — BRANDED ──
  {
    id: 'addon-ferrero-4pc',
    image_path: '/images/addons/chocolates/ferrero-4pc.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Ferrero Rocher 4-piece gift box. A compact rectangular gold-foil gift box containing 4 Ferrero Rocher round chocolates in their distinctive crinkled gold foil wrappers nestled in a brown plastic tray, gold box lid partially open. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-ferrero-8pc',
    image_path: '/images/addons/chocolates/ferrero-8pc.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Ferrero Rocher 8-piece gift box. A rectangular gold-foil gift box containing 8 Ferrero Rocher round chocolates in their crinkled gold foil wrappers arranged in two rows in a brown plastic tray, gold box lid displayed beside it. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-ferrero-moments-8pc',
    image_path: '/images/addons/chocolates/ferrero-moments-8pc.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Ferrero Rocher Moments 8-piece gift box. A compact rectangular box in warm burgundy and gold tones containing 8 small Ferrero Moments chocolate shells — creamy milk chocolate dome-shaped pieces — nestled in individual compartments, lid open. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-ferrero-moments-16pc',
    image_path: '/images/addons/chocolates/ferrero-moments-16pc.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Ferrero Rocher Moments 16-piece gift box. A larger rectangular box in warm burgundy and gold tones containing 16 Ferrero Moments chocolate shells — creamy milk chocolate dome-shaped pieces — arranged in four rows of four in individual compartments, lid positioned open beside the box. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-dairy-milk-silk',
    image_path: '/images/addons/chocolates/dairy-milk-silk.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Cadbury Dairy Milk Silk chocolate bar (60g). A flat, rectangular milk chocolate bar in a purple and white packaging sleeve with a silky smooth texture, partially unwrapped to reveal the glossy milk chocolate inside with individual square segments. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-celebrations-small',
    image_path: '/images/addons/chocolates/celebrations-small.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Cadbury Celebrations assorted chocolate pack (119g). A flat rectangular box in deep purple and gold packaging, lid open to reveal a tray of assorted miniature Cadbury chocolate bars in colourful wrappers — miniature Dairy Milk, Perk, Gems, 5 Star, Éclairs — arranged neatly. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-celebrations-medium',
    image_path: '/images/addons/chocolates/celebrations-medium.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Cadbury Celebrations assorted chocolate pack (172g). A taller rectangular box in deep purple and gold packaging, lid open to reveal two layers of assorted miniature Cadbury chocolate bars in colourful wrappers neatly arranged in a tray. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-lindt-lindor',
    image_path: '/images/addons/chocolates/lindt-lindor.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Lindt Lindor Assorted Gift Box (75g). A compact square gift box in elegant red and gold with a satin ribbon bow, lid open to reveal a mix of smooth Lindt Lindor chocolate truffles in red, white, and dark gold foil wrappers nestled in tissue. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-hersheys-kisses-gift',
    image_path: '/images/addons/chocolates/hersheys-kisses-gift.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      "Create an exceptionally realistic premium commercial product photograph of a Hershey's Kisses Gift Pack (90g). A transparent or windowed gift bag filled with classic Hershey's Kisses — teardrop-shaped milk chocolates each wrapped in silver foil with a small paper ribbon flag — tied with a silver or red satin bow. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.",
  },

  // ── CHOCOLATES — NER CURATED ──
  {
    id: 'addon-melt-munch-combo',
    image_path: '/images/addons/chocolates/melt-munch-combo.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of an assorted Melt & Munch Chocolate Combo. A small curated gift arrangement featuring a selection of milk and dark chocolate bars and bites in mixed colourful wrappers loosely arranged on a small tray or in a kraft paper sleeve, with a branded golden ribbon. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-premium-choc-box',
    image_path: '/images/addons/chocolates/premium-choc-box.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of an Assorted Premium Chocolate Box. An elegant square chocolate gift box in matte black with a gold satin ribbon, lid open to reveal a selection of premium assorted chocolates — pralines, truffles, ganache squares — in individual paper cups, arranged neatly in a black tray insert. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-choc-love-combo',
    image_path: '/images/addons/chocolates/choc-love-combo.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Chocolate & Love Gift Combo. A romantic gift arrangement featuring a small heart-accented box or tray of assorted chocolates — dark, milk and ruby — alongside a small decorative love-themed element such as a rose-petal motif, all tied with a red satin bow. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-heart-choc-box',
    image_path: '/images/addons/chocolates/heart-choc-box.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Heart-Shaped Chocolate Gift Box. A large heart-shaped rigid gift box in deep red or burgundy, lid open to reveal a precisely arranged selection of premium assorted chocolates — round truffles, praline squares, ganache pieces — in individual paper cups in a red-lined tray. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },

  // ── CARDS ──
  {
    id: 'addon-occasion-card',
    image_path: '/images/addons/cards/occasion-card.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of an Occasion Greeting Card. An A5-sized folded greeting card in cream-white premium card stock, with an elegant floral watercolour illustration on the front featuring soft pink roses and green foliage, standing slightly propped open at an angle. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-premium-3d-card',
    image_path: '/images/addons/cards/premium-3d-card.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Premium 3D Greeting Card. An A5-sized folded card in ivory premium card stock, standing open to reveal an intricate laser-cut pop-up 3D scene of a rose garden with layered dimensional paper petals, stems and leaves in white, blush and sage green tones, casting delicate shadows. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },

  // ── PERSONALISATION ──
  {
    id: 'addon-personalised-msg-card',
    image_path: '/images/addons/personalisation/personalised-msg-card.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Personalised Message Card. A small rectangular printed card approximately 10x7cm in premium cream card stock with an elegant decorative border in soft gold, the centre area showing a printed personal message in a beautiful script font, placed on a small envelope. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-handwritten-letter',
    image_path: '/images/addons/personalisation/handwritten-letter.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Handwritten Letter Service. A single sheet of premium ivory textured paper with elegant handwritten text in black ink calligraphy, partially rolled or folded, with a wax seal in deep red beside it, displayed on a subtle wooden surface accent. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-photo-prints',
    image_path: '/images/addons/personalisation/photo-prints.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of Personalised Photo Prints (2 pcs). Two identical-sized high-quality glossy photo prints (approximately 10x15cm) fanned slightly apart, showing a soft blurred romantic colour image (no identifiable faces), with a slim white border and smooth lustre finish, placed on the surface. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-photo-strip',
    image_path: '/images/addons/personalisation/photo-strip.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Mini Photo Strip (4 photos). A narrow vertical strip of printed glossy photo paper approximately 6x20cm divided into four equal photo frames showing soft blurred romantic scenes (no identifiable faces), with thin white borders between each, retro photo-booth aesthetic, slightly curled at the tip. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-name-tag',
    image_path: '/images/addons/personalisation/name-tag.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Personalised Name Tag. A small elegant rectangular tag approximately 7x4cm in premium cream card stock with a gold foil border, showing a personalised name in an elegant script calligraphy font, with a thin satin ribbon threaded through a hole at the top. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-message-bottle',
    image_path: '/images/addons/personalisation/message-bottle.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Message in a Bottle. A small clear glass bottle approximately 12cm tall with a cork stopper, inside which a tightly rolled parchment-style scroll of paper is visible with handwritten script, decorated with tiny dried rose petals inside the bottle, and a thin red ribbon tied around the neck. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-photo-frame',
    image_path: '/images/addons/personalisation/photo-frame.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Personalised Photo Frame. A 4x6-inch desktop photo frame in polished white wood or resin with a slim gold border detail and a small engraved decorative motif at the top corner, holding a soft-focus blurred romantic landscape image (no identifiable faces), standing upright on a small easel back. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-couple-frame',
    image_path: '/images/addons/personalisation/couple-frame.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      "Create an exceptionally realistic premium commercial product photograph of a Couple Keepsake Frame. A wide 8x4-inch desktop frame in soft white resin with two side-by-side apertures each holding soft-focus blurred romantic images (no identifiable faces), joined by an elegant heart motif or engraved 'love' detail at the centre top, with a slim gold accent border. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.",
  },
  {
    id: 'addon-mini-scrapbook',
    image_path: '/images/addons/personalisation/mini-scrapbook.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Mini Scrapbook. A small A6-sized handcrafted scrapbook approximately 10x14cm with a textured floral linen cover in dusty rose, slightly open to reveal creamy blank pages with decorative washi-tape accents, a pressed flower motif, and a thin satin ribbon page marker. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },

  // ── PACKAGING ──
  {
    id: 'addon-gift-tag',
    image_path: '/images/addons/packaging/gift-tag.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Personalised Gift Tag. A small rounded-corner tag approximately 6x3.5cm in premium kraft or cream card stock with a gold foil letterpress border, bearing a personalised name in elegant script, threaded with a thin natural jute twine loop. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-floralife-sachet',
    image_path: '/images/addons/packaging/floralife-sachet.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a FloraLife Flower Food Sachet. A small rectangular paper sachet approximately 8x4cm in white with green botanical print, sealed with a crimped edge, containing white powdered flower preservative, displayed beside a single fresh-cut stem for scale. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-premium-wrapping',
    image_path: '/images/addons/packaging/premium-wrapping.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of Premium Gift Wrapping. A bouquet or box neatly wrapped in soft blush-pink or sage-green textured wrapping paper, gathered at the top and tied with a large lustrous satin bow in champagne or ivory, with the edges crimped cleanly and a small decorative sprig tucked under the bow. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-luxury-wrapping',
    image_path: '/images/addons/packaging/luxury-wrapping.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of Luxury Gift Wrapping. A bouquet elegantly wrapped in layered matte black and gold tissue paper, gathered at the top in a dramatic silhouette, secured with a wide glossy black satin ribbon tied in a large bow, with tiny gold confetti stars scattered at the base. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-satin-ribbon',
    image_path: '/images/addons/packaging/satin-ribbon.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Premium Satin Ribbon. A wide (5cm) satin ribbon in champagne ivory, looped into an elegant bow shape and placed flat to show the lustrous sheen and smooth texture, with two trailing ribbon ends fanning to the sides, fabric weave just visible. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-bouquet-care-kit',
    image_path: '/images/addons/packaging/bouquet-care-kit.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Bouquet Preservation Care Kit. A small white gift-ready zip pouch or box containing a FloraLife sachet, a floral stem cutter or small scissors, a small bottle of flower food solution, and a care instruction card in natural linen paper, arranged neatly together. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },

  // ── BALLOONS ──
  {
    id: 'addon-birthday-foil-balloon',
    image_path: '/images/addons/balloons/birthday-foil-balloon.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Happy Birthday Foil Balloon. A large round metallic foil balloon approximately 45cm diameter in shiny gold or rose-gold, fully inflated and floating, with a thin curling ribbon attached at the base, shot against a clean background. Photograph from a straight-on front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-heart-foil-balloon',
    image_path: '/images/addons/balloons/heart-foil-balloon.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Heart Shape Foil Balloon. A large heart-shaped metallic foil balloon approximately 45cm wide in deep romantic red, fully inflated and floating, with a thin red curling ribbon at the base, with a subtle sheen on the foil surface. Photograph from a straight-on front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-balloon-bunch-5',
    image_path: '/images/addons/balloons/balloon-bunch-5.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Balloon Bunch of 5 pieces. Five round latex balloons in a cheerful mix of pastel colours — blush pink, sky blue, lemon yellow, mint green, and lavender — clustered together at different heights, tied at the base with coloured curling ribbon streamers. Photograph from a straight-on front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-balloon-bunch-10',
    image_path: '/images/addons/balloons/balloon-bunch-10.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Premium Balloon Bunch of 10 pieces. Ten round latex balloons in a lush mix of gold, white, blush pink, and champagne tones at varying heights, tied together with gold and white curling ribbon streamers cascading downward, an impressive celebratory arrangement. Photograph from a straight-on front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-birthday-banner',
    image_path: '/images/addons/balloons/birthday-banner.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Mini Birthday Banner. A small festive bunting banner approximately 60cm long with alternating triangular pennant flags in gold, white, and blush pink, printed with individual letters spelling a celebration, strung on thin gold twine, displayed laid out flat or slightly draped. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },

  // ── ACCESSORIES ──
  {
    id: 'addon-birthday-topper',
    image_path: '/images/addons/accessories/birthday-topper.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Happy Birthday Star Cake Topper. A glittery gold star-shaped cake topper on two thin metal sticks, approximately 10cm wide, with fine gold glitter on both sides, standing upright in a small block of foam for display. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-metallic-candles',
    image_path: '/images/addons/accessories/metallic-candles.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Metallic Candle Set for birthdays. Six slim cylindrical birthday candles in metallic gold and silver finishes, arranged in a fan or small cluster, approximately 10cm tall each, with coloured wax tips, displayed on a small white saucer. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-number-candle',
    image_path: '/images/addons/accessories/number-candle.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      "Create an exceptionally realistic premium commercial product photograph of a Number Candle. A single large numeral-shaped birthday candle — the number '1' — approximately 8cm tall in metallic gold glitter finish with a wick at the top, standing upright on a small white ceramic saucer. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.",
  },
  {
    id: 'addon-led-birthday-candle',
    image_path: '/images/addons/accessories/led-birthday-candle.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      "Create an exceptionally realistic premium commercial product photograph of an LED Birthday Candle. A slim cylindrical LED candle approximately 10cm tall with a realistic flickering amber LED flame at the top, in a cream or white wax body, slightly glowing, displayed beside a small battery on a white surface to show it's battery-operated and reusable. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.",
  },
  {
    id: 'addon-rose-petals-pouch',
    image_path: '/images/addons/accessories/rose-petals-pouch.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Rose Petals Gift Pouch. An elegant small organza or velvet drawstring pouch approximately 10x8cm in deep rose or burgundy, partially open to reveal dried or fresh-looking deep red rose petals spilling gently from the mouth of the pouch onto the surface. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },

  // ── KEEPSAKES ──
  {
    id: 'addon-mini-teddy',
    image_path: '/images/addons/keepsakes/mini-teddy.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Mini Plush Teddy Bear (5–6 inch). A small, super-soft beige plush teddy bear approximately 15cm tall, seated upright with round ears, embroidered black eyes and nose, a small satin bow around its neck in pastel pink or red. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-cuddle-teddy',
    image_path: '/images/addons/keepsakes/cuddle-teddy.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Cute Cuddle Teddy Bear (8–10 inch). A medium-sized soft plush teddy bear approximately 25cm tall in warm caramel brown, seated with rounded chubby proportions, embroidered features, a small satin bow tie in dusty rose, inviting posture. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-medium-teddy',
    image_path: '/images/addons/keepsakes/medium-teddy.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Medium Teddy Bear (12 inch). A huggable 30cm tall premium plush teddy bear in soft honey brown, seated upright with detailed plush texture, embroidered nose and eyes, a wide satin ribbon bow in champagne gold around the neck. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-heart-cushion',
    image_path: '/images/addons/keepsakes/heart-cushion.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Heart-Shaped Cushion. A plump heart-shaped cushion approximately 35cm wide in deep velvety burgundy or dusty rose fabric, fully stuffed and symmetrical, with a small satin bow or embroidered heart detail at the centre top. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-love-cushion',
    image_path: '/images/addons/keepsakes/love-cushion.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      "Create an exceptionally realistic premium commercial product photograph of a Love You Cushion. A rectangular cushion approximately 40x30cm in soft blush pink or white velvet fabric, with 'Love You' elegantly embroidered in script thread at the front centre, plump and neatly presented. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.",
  },
  {
    id: 'addon-scented-candle',
    image_path: '/images/addons/keepsakes/scented-candle.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of an Aromatic Rose Scented Candle. A round ceramic jar candle approximately 8cm diameter, filled with pale pink or ivory soy wax with a braided cotton wick, the jar surface a smooth matte white ceramic, with a soft blush rose petal pressed into the wax top for decoration, lid resting beside. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-premium-candle-jar',
    image_path: '/images/addons/keepsakes/premium-candle-jar.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Premium Scented Candle Jar. A tall glass apothecary-style jar approximately 10cm tall, filled with creamy off-white soy wax and two braided wicks, the glass clear with a brass or matte gold metal lid beside it, an elegant and minimal luxury aesthetic. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },

  // ── ROMANTIC ──
  {
    id: 'addon-velvet-ring-box',
    image_path: '/images/addons/romantic/velvet-ring-box.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Velvet Ring Box. A small square hinged jewellery box approximately 6x6cm covered in deep royal blue or burgundy velvet, slightly open to reveal a padded cream satin interior with a central cushioned ring slot, the velvet texture precise and plush. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-led-fairy-lights',
    image_path: '/images/addons/romantic/led-fairy-lights.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of an LED Fairy Light String. A loosely gathered bundle of warm white micro LED fairy lights on a thin copper wire approximately 2 metres long, with tiny warm glowing LED bulbs visible, the wire coiled naturally and placed on the surface with a gentle glow emanating. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-marry-me-led',
    image_path: '/images/addons/romantic/marry-me-led.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      "Create an exceptionally realistic premium commercial product photograph of a Mini Marry Me LED Sign. A small tabletop neon-effect LED sign approximately 20x8cm spelling 'Marry Me' in a cursive warm white or warm pink LED glow, mounted on a slim black acrylic base, glowing softly. Photograph from a straight-on front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.",
  },
  {
    id: 'addon-romantic-candle-set',
    image_path: '/images/addons/romantic/romantic-candle-set.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Romantic Candle Set (2 pcs). Two matching cylindrical pillar candles approximately 10cm tall in deep rose and ivory white, placed close together with a small scattering of dried rose petals around the base, the candles unlit but pristine. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-romantic-msg-bottle',
    image_path: '/images/addons/romantic/romantic-msg-bottle.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Romantic Message Bottle. A small elegant glass bottle approximately 12cm tall with a swing-top or cork stopper, containing a rolled parchment scroll tied with a thin red ribbon visible through the glass, with a small dried red rose inside the bottle and tiny heart-shaped paper confetti. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },

  // ── PLANTS ──
  {
    id: 'addon-lucky-bamboo',
    image_path: '/images/addons/plants/lucky-bamboo.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a 2-Layer Lucky Bamboo Plant. Two tiers of woven straight bamboo stalks approximately 25cm tall, vibrant emerald green with fresh leaves at the top, rooted in a round glass bowl filled with decorative pebbles and water, tied with a red ribbon at the base. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-jade-plant',
    image_path: '/images/addons/plants/jade-plant.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Jade Plant in a Ceramic Pot. A healthy, bushy jade succulent (Crassula ovata) approximately 20cm tall with thick oval dark-green glossy leaves on woody stems, planted in a smooth matte white ceramic pot approximately 12cm diameter. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-money-plant',
    image_path: '/images/addons/plants/money-plant.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Money Plant in a Ceramic Pot. A lush trailing money plant (Epipremnum aureum) with heart-shaped variegated green and yellow leaves cascading over the edges of a smooth pastel mint or white ceramic pot approximately 12cm diameter. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-small-succulent',
    image_path: '/images/addons/plants/small-succulent.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Small Succulent in a Ceramic Pot. A compact, symmetrical rosette succulent (such as an echeveria) approximately 8cm across with plump sage-green and dusty rose leaves, planted in a small round speckled ceramic pot approximately 8cm diameter. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-peace-lily',
    image_path: '/images/addons/plants/peace-lily.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Peace Lily Plant. A healthy peace lily (Spathiphyllum) approximately 35cm tall with glossy dark green oval leaves and two elegant white spathes in bloom, planted in a smooth matte white ceramic or resin pot approximately 15cm diameter. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-snake-plant',
    image_path: '/images/addons/plants/snake-plant.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Snake Plant in a Decorative Pot. A striking Sansevieria trifasciata approximately 40cm tall with upright sword-like leaves in dark green with lighter green horizontal banding and yellow margins, planted in a textured geometric decorative pot in matte charcoal or terracotta. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-mini-indoor-plant',
    image_path: '/images/addons/plants/mini-indoor-plant.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Mini Indoor Plant Gift. A charming small air-purifying houseplant — such as a baby fern or mini pothos — approximately 15cm tall with lush green leaves, in a small matte white or blush ceramic pot with drainage saucer, with a small kraft paper gift tag tied with jute twine. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-premium-planter',
    image_path: '/images/addons/plants/premium-planter.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Premium Decorative Planter. A large statement decorative planter approximately 20cm tall in a sculptural shape — fluted or geometric — in matte sage green or warm terracotta ceramic with a hand-painted gold rim detail, without a plant (displayed empty), showing the craftsmanship of the vessel itself. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },

  // ── HOME & LIFESTYLE ──
  {
    id: 'addon-reed-diffuser',
    image_path: '/images/addons/homedecor/reed-diffuser.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Reed Diffuser. A slender glass bottle approximately 15cm tall filled with clear amber or pale reed diffuser oil, with 6–8 natural rattan reeds fanning upward from the bottle neck, displayed on a small circular marble coaster. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-mini-aroma-diffuser',
    image_path: '/images/addons/homedecor/mini-aroma-diffuser.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Mini Aroma Diffuser. A compact teardrop-shaped ultrasonic aroma diffuser approximately 12cm tall in matte white plastic with a subtle wood-grain lower section, emitting a wisp of fine mist from the top, displayed with its USB cable neatly coiled beside. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-candle-holder',
    image_path: '/images/addons/homedecor/candle-holder.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Decorative Candle Holder. A small artisan glass votive candle holder approximately 8cm tall in an elegant faceted or ribbed design, in smoky amber or blush rose glass, holding a small tea light candle inside which glows warmly. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-wind-chime',
    image_path: '/images/addons/homedecor/wind-chime.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Mini Wind Chime. A small decorative wind chime approximately 25cm in total length, with a circular wooden or bamboo top ring, 5–6 thin aluminium or ceramic tubes of varying lengths hanging on natural twine, with a small decorative sail piece in the centre, displayed hanging. Photograph from a straight-on front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-deco-table-ornament',
    image_path: '/images/addons/homedecor/deco-table-ornament.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Decorative Table Ornament. A small artisan sculptural home decor piece approximately 12cm tall — such as a geometric brass or resin abstract form — in matte gold or champagne tone, displayed as a standalone tabletop accent with refined proportions. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-home-fragrance-set',
    image_path: '/images/addons/homedecor/home-fragrance-set.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Premium Home Fragrance Set. A curated gift set comprising a small reed diffuser bottle, a matching scented candle jar, and a small linen sachet, all in a coordinated matte white and gold aesthetic, presented in an open kraft paper gift box lined with tissue paper. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
  {
    id: 'addon-deco-vase',
    image_path: '/images/addons/homedecor/deco-vase.webp',
    image_generation_status: 'pending',
    image_generation_prompt:
      'Create an exceptionally realistic premium commercial product photograph of a Small Decorative Vase. A slender ceramic bud vase approximately 15cm tall in a smooth matte finish — in blush, sage or cream — with a narrow neck and a gently flared rim, displayed empty to showcase the refined shape and ceramic texture. Photograph from a 45-degree elevated front angle centred on a refined warm ivory or cream studio surface. Use soft diffused studio lighting, subtle natural shadows, professional product photography styling, accurate proportions and a luxurious gifting aesthetic. No text, no watermarks, no logos, no additional unrelated objects. Square 1:1 aspect ratio product image.',
  },
];
