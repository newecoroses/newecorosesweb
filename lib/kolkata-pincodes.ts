// ── Kolkata Delivery Pincode Checker (15km radius from Tollygunge) ─────────────
// Store center: Tollygunge / Regent Park, Kolkata (22.4988° N, 88.3475° E)
// Maximum serviceable radius: 15.0 km

export interface PincodeInfo {
  area: string;
  dist: number; // in km
}

export interface PincodeCheckResult {
  isValidFormat: boolean;
  isServiceable: boolean;
  city: string;
  state: string;
  area?: string;
  distanceKm?: number;
  status: 'empty' | 'invalid' | 'serviceable' | 'unserviceable';
  message: string;
}

// ── Verified Serviceable Pincodes within 15 km of Tollygunge ──────────────────
export const SERVICEABLE_KOLKATA_PINCODES: Record<string, PincodeInfo> = {
  // Tollygunge & Immediate Surrounds (0 - 3 km)
  '700033': { area: 'Tollygunge / Prince Anwar Shah Road', dist: 0.1 },
  '700040': { area: 'Regent Park / Kudghat / Ranikuthi', dist: 1.6 },
  '700068': { area: 'Golf Green / Bikramgarh', dist: 1.3 },
  '700092': { area: 'Netaji Nagar / Gandhi Colony', dist: 1.9 },
  '700093': { area: 'Bikramgarh / Jadavpur West', dist: 1.4 },
  '700095': { area: 'Lake Gardens Railway Colony', dist: 1.1 },
  '700045': { area: 'Lake Gardens / Prince Gulam Md', dist: 0.9 },
  '700070': { area: 'Bansdroni / Brahmapur', dist: 2.3 },
  '700047': { area: 'Naktala / Ganguly Bagan', dist: 2.9 },
  '700032': { area: 'Jadavpur / Sukanta Setu', dist: 2.5 },
  '700082': { area: 'Haridevpur / Karunamoyee', dist: 2.5 },
  '700053': { area: 'New Alipore / Block G & O', dist: 2.4 },
  '700031': { area: 'Dhakuria / Selimpur', dist: 2.1 },
  '700029': { area: 'Southern Avenue / Sarat Bose Road', dist: 1.8 },
  '700026': { area: 'Kalighat / Rashbehari', dist: 2.3 },
  '700027': { area: 'Alipore / Chetla', dist: 3.2 },
  '700038': { area: 'Sahapur / New Alipore North', dist: 2.9 },
  '700034': { area: 'Behala / Manton', dist: 3.1 },
  '700008': { area: 'Barisha / Silpara', dist: 3.8 },
  '700086': { area: 'Baghajatin / Chittaranjan Colony', dist: 3.3 },
  '700078': { area: 'Haltu / Garfa', dist: 3.4 },
  '700065': { area: 'Garfa / Nandi Bagan', dist: 2.8 },
  '700075': { area: 'Santoshpur / Ajoy Nagar', dist: 4.1 },
  '700096': { area: 'Baishnabghata / Patuli', dist: 4.3 },
  '700084': { area: 'Garia / Mahamayatala', dist: 5.4 },

  // South Central & Core Kolkata (3 - 8 km)
  '700019': { area: 'Ballygunge / Gariahat', dist: 3.6 },
  '700025': { area: 'Bhawanipore / Jadubabu Bazar', dist: 3.4 },
  '700020': { area: 'Elgin / Rabindra Sadan / AJC Bose Road', dist: 4.4 },
  '700017': { area: 'Park Circus / Circus Avenue', dist: 4.9 },
  '700016': { area: 'Park Street / Russell Street', dist: 5.8 },
  '700071': { area: 'Park Street South / Camac Street', dist: 5.3 },
  '700042': { area: 'Kasba / Bosepukur', dist: 4.0 },
  '700039': { area: 'Tiljala / Picnic Garden', dist: 5.2 },
  '700041': { area: 'Parnasree / Behala West', dist: 4.6 },
  '700060': { area: 'Parnasree Pally / Taratala Extn', dist: 4.8 },
  '700061': { area: 'Sarsuna / Shakuntala Park', dist: 6.2 },
  '700063': { area: 'Thakurpukur / Silpara South', dist: 5.6 },
  '700088': { area: 'Taratala / Alipore Mint', dist: 3.9 },
  '700018': { area: 'Brace Bridge / Hyde Road', dist: 6.1 },
  '700022': { area: 'Hastings', dist: 5.8 },
  '700023': { area: 'Kidderpore / Watgunge', dist: 4.8 },
  '700024': { area: 'Garden Reach / Metiabruz', dist: 6.9 },
  '700043': { area: 'Metiabruz / Badartala', dist: 7.9 },
  '700094': { area: 'Panchasayar / Peerless Hospital', dist: 5.8 },
  '700099': { area: 'Mukundapur / Kalikapur / EM Bypass', dist: 5.5 },
  '700107': { area: 'Ruby / Kasba East / Madurdaha', dist: 5.8 },
  '700159': { area: 'Kalikapur South', dist: 6.6 },
  '700105': { area: 'Science City / Topsia South', dist: 6.7 },
  '700046': { area: 'Tangra / Gobinda Khatick / Topsia', dist: 6.9 },
  '700015': { area: 'Taltala / Park Circus North', dist: 6.0 },
  '700014': { area: 'Entally / Moulali / CIT Road', dist: 6.4 },
  '700021': { area: 'Fort William / Maidan', dist: 6.3 },
  '700069': { area: 'Esplanade / Chowringhee', dist: 7.3 },
  '700087': { area: 'New Market / Lindsay Street', dist: 6.7 },
  '700013': { area: 'Dharamtala / Lenin Sarani', dist: 7.1 },
  '700072': { area: 'Chandni Chowk / Wellington', dist: 7.5 },
  '700001': { area: 'B.B.D. Bagh / Dalhousie', dist: 8.2 },
  '700012': { area: 'Bowbazar / College Street', dist: 7.9 },
  '700073': { area: 'Colootola / Medical College', dist: 8.3 },
  '700009': { area: 'Sealdah / Amherst Street', dist: 8.4 },
  '700010': { area: 'Beliaghata / CIT Scheme', dist: 8.4 },
  '700011': { area: 'Narkeldanga / Rajabazar', dist: 8.9 },

  // South Extended Suburban (within 15 km)
  '700103': { area: 'Narendrapur / Ramakrishna Mission', dist: 8.3 },
  '700104': { area: 'Joka / IIM Calcutta Area', dist: 8.2 },
  '700150': { area: 'Sonarpur Station Area', dist: 10.5 },
  '700151': { area: 'Rajpur / Garia South', dist: 11.0 },
  '700152': { area: 'Harinavi', dist: 11.8 },
  '700153': { area: 'Kodalia', dist: 10.7 },

  // Central North & Salt Lake (8 - 14.5 km)
  '700007': { area: 'Burrabazar / Posta', dist: 9.4 },
  '700006': { area: 'Girish Park / Simla', dist: 9.8 },
  '700005': { area: 'Sovabazar / Kumartuli', dist: 10.9 },
  '700004': { area: 'Shyambazar / Hatibagan', dist: 11.5 },
  '700003': { area: 'Bagbazar / Shyambazar North', dist: 11.8 },
  '700054': { area: 'Kankurgachi / Phoolbagan', dist: 9.8 },
  '700085': { area: 'Beliaghata CIT / Subhas Sarobar', dist: 9.0 },
  '700067': { area: 'Ultadanga / VIP Crossing', dist: 11.2 },
  '700037': { area: 'Belgachia / Milk Colony', dist: 12.6 },
  '700064': { area: 'Salt Lake Sector 1', dist: 12.1 },
  '700106': { area: 'Salt Lake Sector 2 / Karunamoyee', dist: 11.7 },
  '700098': { area: 'Salt Lake Sector 3 / Stadium Area', dist: 10.3 },
  '700091': { area: 'Salt Lake Sector 5 / Tech Hub', dist: 11.8 },
  '700100': { area: 'Kadapara / EM Bypass North', dist: 9.5 },
  '700048': { area: 'Lake Town / Dakshindari', dist: 13.1 },
  '700055': { area: 'Bangur Avenue', dist: 13.7 },
  '700089': { area: 'Kalindi / Patipukur', dist: 13.8 },
  '700002': { area: 'Cossipore / Seven Tanks', dist: 14.1 },
  '700050': { area: 'Sinthee / Ghoshpara', dist: 14.8 },
  '700113': { area: 'Chitpur / RG Kar Hospital Area', dist: 11.9 },
  '700101': { area: 'Kestopur / Hanapara', dist: 14.4 },
};

// ── Known Unserviceable Pincodes Outside 15 km Radius ────────────────────────
export const OUTSIDE_RADIUS_PINCODES: Record<string, PincodeInfo> = {
  '700028': { area: 'Dum Dum', dist: 18.1 },
  '700030': { area: 'Dum Dum Cantonment', dist: 17.9 },
  '700035': { area: 'Alambazar / Dunlop', dist: 17.0 },
  '700036': { area: 'Baranagar / Bonhooghly', dist: 15.8 },
  '700049': { area: 'Nimta / Belgharia East', dist: 19.7 },
  '700051': { area: 'Birati / Gouripur', dist: 20.8 },
  '700052': { area: 'Kolkata Airport', dist: 20.0 },
  '700056': { area: 'Belgharia', dist: 18.7 },
  '700057': { area: 'Ariadaha', dist: 19.2 },
  '700058': { area: 'Kamarhati', dist: 19.8 },
  '700059': { area: 'Kaikhali / Teghoria', dist: 17.5 },
  '700074': { area: 'Nagerbazar / Motijheel', dist: 16.6 },
  '700076': { area: 'Dakshineswar', dist: 17.8 },
  '700097': { area: 'Baguiati / Jora Mandir', dist: 15.6 },
  '700102': { area: 'Rajarhat / Chinar Park', dist: 16.8 },
  '700108': { area: 'Dunlop Bridge', dist: 17.1 },
  '700109': { area: 'Panihati', dist: 21.0 },
  '700110': { area: 'Sodepur', dist: 22.5 },
  '700111': { area: 'Rohanda', dist: 23.0 },
  '700112': { area: 'New Barrackpore', dist: 24.2 },
  '700114': { area: 'Madhyamgram', dist: 25.5 },
  '700115': { area: 'Khardah', dist: 24.5 },
  '700117': { area: 'Khardah Station', dist: 25.1 },
  '700120': { area: 'Barrackpore', dist: 31.0 },
  '700124': { area: 'Barasat', dist: 28.5 },
  '700135': { area: 'Rajarhat Gopalpur', dist: 18.2 },
  '700136': { area: 'New Town Action Area 2', dist: 18.8 },
  '700144': { area: 'Baruipur', dist: 19.2 },
  '700154': { area: 'Champahati', dist: 18.0 },
  '700156': { area: 'New Town Action Area 1', dist: 16.0 },
  '700157': { area: 'Chakpachuria / Eco Space', dist: 16.8 },
  '700160': { area: 'New Town Action Area 3', dist: 21.5 },
};

export const MAX_DELIVERY_RADIUS_KM = 15.0;

/**
 * Checks a pincode string and returns full serviceability details.
 */
export function evaluatePincode(rawInput: string): PincodeCheckResult {
  const pin = (rawInput || '').replace(/\D/g, '').trim();

  if (!pin) {
    return {
      isValidFormat: false,
      isServiceable: false,
      city: '',
      state: 'West Bengal',
      status: 'empty',
      message: 'Please enter your 6-digit PIN code.',
    };
  }

  if (pin.length !== 6) {
    return {
      isValidFormat: false,
      isServiceable: false,
      city: pin.startsWith('700') ? 'Kolkata' : '',
      state: 'West Bengal',
      status: 'invalid',
      message: 'PIN code must be exactly 6 digits.',
    };
  }

  // Check if non-Kolkata (does not start with 700)
  if (!pin.startsWith('700')) {
    return {
      isValidFormat: true,
      isServiceable: false,
      city: '',
      state: '',
      status: 'unserviceable',
      message: 'Delivery is currently available exclusively in Kolkata within 15 km of Tollygunge.',
    };
  }

  // Check if inside 15km serviceable list
  const serviceableInfo = SERVICEABLE_KOLKATA_PINCODES[pin];
  if (serviceableInfo) {
    return {
      isValidFormat: true,
      isServiceable: true,
      city: 'Kolkata',
      state: 'West Bengal',
      area: serviceableInfo.area,
      distanceKm: serviceableInfo.dist,
      status: 'serviceable',
      message: `Delivery available to ${serviceableInfo.area}, Kolkata (~${serviceableInfo.dist} km from Tollygunge).`,
    };
  }

  // Check known unserviceable outer suburbs
  const outsideInfo = OUTSIDE_RADIUS_PINCODES[pin];
  if (outsideInfo) {
    return {
      isValidFormat: true,
      isServiceable: false,
      city: 'Kolkata',
      state: 'West Bengal',
      area: outsideInfo.area,
      distanceKm: outsideInfo.dist,
      status: 'unserviceable',
      message: `Delivery to ${outsideInfo.area} (${outsideInfo.dist} km) is outside our 15km radius from Tollygunge.`,
    };
  }

  // Any other 700xxx not in the within-15km list
  return {
    isValidFormat: true,
    isServiceable: false,
    city: 'Kolkata',
    state: 'West Bengal',
    status: 'unserviceable',
    message: `PIN ${pin} is outside our current 15 km delivery radius from Tollygunge, Kolkata.`,
  };
}
