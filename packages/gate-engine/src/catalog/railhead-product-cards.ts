/** Client railhead product cards — from docs/frontend/foto-intake/railheads-catalog.json. */
export type RailheadProductCard = {
  code: string
  title: string
  sizeMm: string | null
  flags: string[]
  photoFile: string
}

export const RAILHEAD_PRODUCT_CARDS: Record<string, RailheadProductCard> = {
  "RH1": {
    "code": "RH1",
    "title": "RH1 Railhead 184",
    "sizeMm": "184 × 89 × 20 mm",
    "flags": [],
    "photoFile": "RH1"
  },
  "RH10": {
    "code": "RH10",
    "title": "RH10 Railhead 125 x 48 x 25mm",
    "sizeMm": "125 × 48 × 25 mm",
    "flags": [],
    "photoFile": "RH10"
  },
  "RH100": {
    "code": "RH100",
    "title": "RH100 Railhead 160 × 70",
    "sizeMm": "160 × 70 × 28 mm",
    "flags": [],
    "photoFile": "RH100"
  },
  "RH102A": {
    "code": "RH102A",
    "title": "RH102A Railhead 140 × 70",
    "sizeMm": "140 × 70 × 26 mm",
    "flags": [],
    "photoFile": "RH102A"
  },
  "RH108": {
    "code": "RH108",
    "title": "RH108 Railhead 110 x 65 x 20mm",
    "sizeMm": "110 × 65 × 20 mm",
    "flags": [],
    "photoFile": "RH108"
  },
  "RH109": {
    "code": "RH109",
    "title": "RH109 Railhead 160 x 62",
    "sizeMm": "160 × 62 × 16 mm",
    "flags": [],
    "photoFile": "RH109"
  },
  "RH110": {
    "code": "RH110",
    "title": "RH110 Railhead 250 x 102 x 25mm",
    "sizeMm": "250 × 102 × 25 mm",
    "flags": [],
    "photoFile": "RH110"
  },
  "RH111": {
    "code": "RH111",
    "title": "RH111 Railhead 115 x 30",
    "sizeMm": "115 × 30 × 25 mm",
    "flags": [],
    "photoFile": "RH111"
  },
  "RH112": {
    "code": "RH112",
    "title": "RH112 Railhead 124 × 74",
    "sizeMm": "124 × 74 × 16 mm",
    "flags": [],
    "photoFile": "RH112"
  },
  "RH113": {
    "code": "RH113",
    "title": "RH113 Railhead 165 × 85",
    "sizeMm": "165 × 85 × 18 mm",
    "flags": [],
    "photoFile": "RH113"
  },
  "RH114": {
    "code": "RH114",
    "title": "RH114 Railhead 140 x 65",
    "sizeMm": "140 × 65 × 16 mm",
    "flags": [],
    "photoFile": "RH114"
  },
  "RH122": {
    "code": "RH122",
    "title": "RH122 Railhead 160 x 65 x 16mm",
    "sizeMm": "160 × 65 × 16 mm",
    "flags": [],
    "photoFile": "RH122"
  },
  "RH124": {
    "code": "RH124",
    "title": "RH124 Railhead 205 x 60 x 20mm",
    "sizeMm": "205 × 60 × 20 mm",
    "flags": [],
    "photoFile": "RH124"
  },
  "RH125": {
    "code": "RH125",
    "title": "RH125 Railhead 170 × 60 × 20mm",
    "sizeMm": "170 × 60 × 20 mm",
    "flags": [],
    "photoFile": "RH125"
  },
  "RH126": {
    "code": "RH126",
    "title": "RH126 Railhead 130 x 25",
    "sizeMm": "130 × 25 × 20 mm",
    "flags": [],
    "photoFile": "RH126"
  },
  "RH128": {
    "code": "RH128",
    "title": "RH128 Railhead 180 x 65 x 20mm",
    "sizeMm": "180 × 65 × 20 mm",
    "flags": [],
    "photoFile": "RH128"
  },
  "RH13": {
    "code": "RH13",
    "title": "RH13 Railhead 125 × 40",
    "sizeMm": "125 × 40 × 18 mm",
    "flags": [],
    "photoFile": "RH13"
  },
  "RH130": {
    "code": "RH130",
    "title": "RH130 Railhead 100 × 44",
    "sizeMm": "100 × 44 × 12 mm",
    "flags": [],
    "photoFile": "RH130"
  },
  "RH14": {
    "code": "RH14",
    "title": "RH14 Railhead 95 x 25 x 12mm",
    "sizeMm": "95 × 25 × 12 mm",
    "flags": [],
    "photoFile": "RH14"
  },
  "RH149": {
    "code": "RH149",
    "title": "RH149 Railhead 130 x 60",
    "sizeMm": "130 × 60 × 12 mm",
    "flags": [],
    "photoFile": "RH149"
  },
  "RH151": {
    "code": "RH151",
    "title": "RH151 Railhead 162 × 36",
    "sizeMm": "162 × 36 × 22 mm",
    "flags": [],
    "photoFile": "RH151"
  },
  "RH157": {
    "code": "RH157",
    "title": "RH157 Railhead 130mm High",
    "sizeMm": "130 mm",
    "flags": [],
    "photoFile": "RH157"
  },
  "RH159": {
    "code": "RH159",
    "title": "RH159 Railhead 130mm High",
    "sizeMm": "130 mm",
    "flags": [],
    "photoFile": "RH159"
  },
  "RH15WO": {
    "code": "RH15W/O",
    "title": "RH15W/O Railhead No Stub",
    "sizeMm": "124 × 26 × 18 mm",
    "flags": [],
    "photoFile": "RH15W"
  },
  "RH16": {
    "code": "RH16",
    "title": "RH16 Railhead 157 × 38",
    "sizeMm": "157 × 38 × 30 mm",
    "flags": [],
    "photoFile": "RH16"
  },
  "RH160": {
    "code": "RH160",
    "title": "RH160 Railhead 160mm High 25 x 25mm Base",
    "sizeMm": "160 mm",
    "flags": [],
    "photoFile": "RH160"
  },
  "RH17": {
    "code": "RH17",
    "title": "RH17 Railhead 188 x 50",
    "sizeMm": "188 × 50 × 40 mm",
    "flags": [],
    "photoFile": "RH17"
  },
  "RH18": {
    "code": "RH18",
    "title": "RH18 Railhead 80 x 46 x 20mm",
    "sizeMm": "80 × 46 × 20 mm",
    "flags": [],
    "photoFile": "RH18"
  },
  "RH19": {
    "code": "RH19",
    "title": "RH19 Railhead 120 x 65",
    "sizeMm": "120 × 65 × 25 mm",
    "flags": [],
    "photoFile": "RH19"
  },
  "RH2": {
    "code": "RH2",
    "title": "RH2 Railhead 150 x 70 x 16mm",
    "sizeMm": "150 × 70 × 16 mm",
    "flags": [],
    "photoFile": "RH2"
  },
  "RH27": {
    "code": "RH27",
    "title": "RH27 Railhead 152 x 62",
    "sizeMm": "152 × 62 × 16 mm",
    "flags": [],
    "photoFile": "RH27"
  },
  "RH32": {
    "code": "RH32",
    "title": "RH32 Railhead 136 x 60",
    "sizeMm": "136 × 60 × 14 mm",
    "flags": [],
    "photoFile": "RH32"
  },
  "RH36": {
    "code": "RH36",
    "title": "RH36 Railhead 150 x 44",
    "sizeMm": "150 × 44 × 33 mm",
    "flags": [],
    "photoFile": "RH36"
  },
  "RH37": {
    "code": "RH37",
    "title": "RH37 Railhead 120 x 35",
    "sizeMm": "120 × 35 × 30 mm",
    "flags": [],
    "photoFile": "RH37"
  },
  "RH38": {
    "code": "RH38",
    "title": "RH38 Railhead 165 x 60",
    "sizeMm": "165 × 60 × 24 mm",
    "flags": [],
    "photoFile": "RH38"
  },
  "RH39": {
    "code": "RH39",
    "title": "RH39 Railhead 185 x 70",
    "sizeMm": "185 × 70 × 27 mm",
    "flags": [],
    "photoFile": "RH39"
  },
  "RH3S": {
    "code": "RH3S",
    "title": "RH3S Railhead 113 x 55",
    "sizeMm": "113 × 55 × 12 mm",
    "flags": [],
    "photoFile": "RH3S"
  },
  "RH41": {
    "code": "RH41",
    "title": "RH41 Railhead 120 x 60",
    "sizeMm": "120 × 60 × 25 mm",
    "flags": [],
    "photoFile": "RH41"
  },
  "RH42": {
    "code": "RH42",
    "title": "RH42 Railhead 158 x 93",
    "sizeMm": "158 × 93 × 30 mm",
    "flags": [],
    "photoFile": "RH42"
  },
  "RH43": {
    "code": "RH43",
    "title": "RH43 Railhead 200 x 118",
    "sizeMm": "200 × 118 × 40 mm",
    "flags": [],
    "photoFile": "RH43"
  },
  "RH45": {
    "code": "RH45",
    "title": "RH45 Railhead 134 x 40 x 25mm",
    "sizeMm": "134 × 40 × 25 mm",
    "flags": [],
    "photoFile": "RH45"
  },
  "RH47": {
    "code": "RH47",
    "title": "RH47 Railhead 162 × 90",
    "sizeMm": "162 × 90 × 16 mm",
    "flags": [],
    "photoFile": "RH47"
  },
  "RH51": {
    "code": "RH51",
    "title": "RH51 Railhead 145 x 48 × 26mm",
    "sizeMm": "145 × 48 × 26 mm",
    "flags": [],
    "photoFile": "RH51"
  },
  "RH52": {
    "code": "RH52",
    "title": "RH52 Railhead 110 x 55 x 26mm",
    "sizeMm": "110 × 55 × 26 mm",
    "flags": [],
    "photoFile": "RH52"
  },
  "RH55": {
    "code": "RH55",
    "title": "RH55 Railhead 133 x 72",
    "sizeMm": "133 × 72 × 20 mm",
    "flags": [],
    "photoFile": "RH55"
  },
  "RH56": {
    "code": "RH56",
    "title": "RH56 Railhead 125 x 59",
    "sizeMm": "125 × 59 × 30 mm",
    "flags": [],
    "photoFile": "RH56"
  },
  "RH59": {
    "code": "RH59",
    "title": "RH59 Railhead 194 x 108",
    "sizeMm": "194 × 108 × 30 mm",
    "flags": [],
    "photoFile": "RH59"
  },
  "RH6": {
    "code": "RH6",
    "title": "RH6 Railhead 153 x 24 x 24mm",
    "sizeMm": "153 × 24 × 24 mm",
    "flags": [],
    "photoFile": "RH6"
  },
  "RH62": {
    "code": "RH62",
    "title": "RH62 Railhead 60 x 33 x 24mm",
    "sizeMm": "60 × 33 × 24 mm",
    "flags": [],
    "photoFile": "RH62"
  },
  "RH64": {
    "code": "RH64",
    "title": "RH64 Railhead 140 × 60",
    "sizeMm": "140 × 60 × 14 mm",
    "flags": [],
    "photoFile": "RH64"
  },
  "RH6A": {
    "code": "RH6A",
    "title": "RH6A Railhead 146 × 40",
    "sizeMm": "146 × 40 × 40 mm",
    "flags": [],
    "photoFile": "RH6A"
  },
  "RH6WB": {
    "code": "RH6W/B",
    "title": "RH6W/B Railhead With Ball",
    "sizeMm": "100 × 20 × 20 mm",
    "flags": [
      "with ball"
    ],
    "photoFile": "RH6WB"
  },
  "RH7": {
    "code": "RH7",
    "title": "RH7 Railhead 125 x 60 x 12mm",
    "sizeMm": "125 × 60 × 12 mm",
    "flags": [],
    "photoFile": "RH7"
  },
  "RH70": {
    "code": "RH70",
    "title": "RH70 Railhead 180 x 52 x 20mm",
    "sizeMm": "180 × 52 × 20 mm",
    "flags": [],
    "photoFile": "RH70"
  },
  "RH71": {
    "code": "RH71",
    "title": "RH71 Railhead 146 x 67 × 16mm",
    "sizeMm": "146 × 67 × 16 mm",
    "flags": [],
    "photoFile": "RH71"
  },
  "RH73": {
    "code": "RH73",
    "title": "RH73 Railhead 138 x 60",
    "sizeMm": "138 × 60 × 12 mm",
    "flags": [],
    "photoFile": "RH73"
  },
  "RH75": {
    "code": "RH75",
    "title": "RH75 Railhead 110 x 48 x 18mm",
    "sizeMm": "110 × 48 × 18 mm",
    "flags": [],
    "photoFile": "RH75"
  },
  "RH79": {
    "code": "RH79",
    "title": "RH79 Railhead 153 x 70 x 16mm",
    "sizeMm": "153 × 70 × 16 mm",
    "flags": [],
    "photoFile": "RH79"
  },
  "RH7NP": {
    "code": "RH7NP",
    "title": "RH7NP Railhead No Peg 110",
    "sizeMm": "110 × 60 × 20 mm",
    "flags": [
      "no peg"
    ],
    "photoFile": "RH7NP"
  },
  "RH81": {
    "code": "RH81",
    "title": "RH81 Railhead 210 x 110",
    "sizeMm": "210 × 110 × 25 mm",
    "flags": [],
    "photoFile": "RH81"
  },
  "RH9": {
    "code": "RH9",
    "title": "RH9 Railhead 187 × 87 × 16mm",
    "sizeMm": "187 × 87 × 16 mm",
    "flags": [],
    "photoFile": "RH9"
  }
}
