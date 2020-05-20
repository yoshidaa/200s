var vecs = vecs || {}

vecs["count_up"] = {
  "params": { "game": "count_up" },
  "darts": [
    [
      [ "T20",  "T20",  "T20" ],
      [ "IS20", "T19",  "T19" ],
      [ "T19",  "OS19", "T18" ],
      [ "T18",  "T18",  "OS18" ],
      [ "T17",  "T17",  "T17" ],
      [ "IS17", "T16",  "T16" ],
      [ "T16",  "IS16", "T15" ],
      [ "T15",  "T15",  "OS15" ],
      ],
    [
      [ "T20",  "T20",  "T20" ],
      [ "IS20", "T19",  "T19" ],
      [ "T19",  "OS19", "T18" ],
      [ "T18",  "T18",  "OS18" ],
      [ "T17",  "T17",  "T17" ],
      [ "IS17", "T16",  "T16" ],
      [ "T16",  "IS16", "T15" ],
      [ "T15",  "T15",  "OS15" ],
      ]
    ],
  "exps": {
    "result": [
      { "darts": 24,
        "winner": { win: true, value: "<span>WONDERFUL!!</span>" },
        "score": 1050,
        "awards": { "lowton": 6, "highton": 1, "ton80": 1 },
        "stats": 43.75
        },
      { "darts": 24,
        "winner": { win: true, value: "<span>WONDERFUL!!</span>" },
        "score": 1050,
        "awards": { "lowton": 6, "highton": 1, "ton80": 1 },
        "stats": 43.75
        }
      ]
    }
};

vecs["cr_count_up"] = {
  "params": { "game": "cr_count_up" },
  "darts": [
    [
      [ "T20",  "T20",  "IS20" ],
      [ "IS19", "IS19", "IS19" ],
      [ "T18",  "OS19", "T18" ],
      [ "T17",  "T16",  "T17" ],
      [ "T16",  "T16",  "OS16" ],
      [ "IS15", "OS15", "OS15" ],
      [ "SB",   "DB",   "SB" ],
      [ "T18",  "T19",  "T20" ],
      ],
    [
      [ "T20",  "T20",  "T20" ],
      [ "IS20", "T19",  "T19" ],
      [ "T19",  "OS19", "T18" ],
      [ "T18",  "T18",  "OS18" ],
      [ "T17",  "T17",  "T17" ],
      [ "IS17", "T16",  "T16" ],
      [ "T16",  "IS16", "T15" ],
      [ "T15",  "T15",  "OS15" ],
      ]
    ],
  "exps": {
    "result": [
      { "darts": 24,
        "winner": { win: true, value: "<span>WONDERFUL!!</span>" },
        "score": 835,
        "awards": { "hattrick": 1, "7mark": 2, "6mark": 2, "whitehorse": 1 },
        "stats": 5.63
        },
      { "darts": 24,
        "winner": { win: false, value: "<span>GREAT!</span>" },
        "awards": { "ton80": 1, "7mark": 1, "6mark": 1 },
        "stats": 3.13
        }
      ]
    }
};

vecs["301(normal)"] = {
  "params": { "game": "z0301" },
  "darts": [
    [
      [ "T20",  "T20",  "T20" ],
      [ "T20",  "IS11", "DB" ],
      ],
    ],
  "exps": {
    "result": [
      { "darts": 6,
        "winner": { win: true, value: "<span>WONDERFUL!!</span>" },
        "score": 0,
        "awards": { "lowton": 1, "ton80": 1 },
        "stats": 50.17
        },
      ]
    }
};

vecs["301(bust)"] = {
  "params": { "game": "z0301" },
  "darts": [
    [
      [ "DB",  "DB",  "DB" ],
      [ "DB",  "DB",  "DB" ],
      [ "DB" ], // BUST
      [ "OS01" ],
      ],
    ],
  "exps": {
    "result": [
      { "darts": 10,
        "winner": { win: true, value: "<span>EXCELLENT!!</span>" },
        "score": 0,
        "awards": { "black": 2 },
        "stats": 30.10
        },
      ]
    }
};

vecs["301(master_out)"] = {
  "params": { "game": "z0301", "options": '[{"bull":"50_50","out":"MASTER"}]' },
  "darts": [
    [
      [ "DB",  "DB",  "DB" ],
      [ "DB",  "DB",  "DB" ], // BUST(1)
      [ "DB" ],               // BUST(-49)
      [ "OS01", "DB", "DB" ]
      ],
    ],
  "exps": {
    "result": [
      { "darts": 12,
        "winner": { win: true, value: "<span>GREAT!</span>" },
        "score": 0,
        "awards": { "lowton": 1, "black": 1 },
        "stats": 25.08
        },
      ]
    }
};

vecs["301(double_out0)"] = {
  "params": { "game": "z0301", "options": '[{"bull":"50_50","out":"DOUBLE"}]' },
  "darts": [
    [
      [ "DB",  "DB",  "DB" ],
      [ "DB",  "DB",  "SB" ], // BUST(1)
      [ "SB" ],               // BUST(-49)
      [ "OS01", "DB", "SB" ], // BUST(0)
      [ "OS01", "T20", "D20" ],
      ],
    ],
  "exps": {
    "result": [
      { "darts": 15,
        "winner": { win: true, value: "" },
        "score": 0,
        "awards": { "lowton": 1, "black": 1 },
        "stats": 20.07
        },
      ]
    }
};

vecs["301(double_out1)"] = {
  "params": { "game": "z0301", "options": '[{"bull":"50_50","out":"DOUBLE"}]' },
  "darts": [
    [
      [ "DB",  "DB",  "DB" ],
      [ "DB",  "DB",  "SB" ], // BUST(1)
      [ "SB" ],               // BUST(-49)
      [ "OS01", "DB", "SB" ], // BUST(0)
      [ "OS01", "DB", "SB" ], // BUST(0)
      [ "OS01", "SB", "DB" ],
      ],
    ],
  "exps": {
    "result": [
      { "darts": 18,
        "winner": { win: true, value: "" },
        "score": 0,
        "awards": { "lowton": 1, "black": 1 },
        "stats": 16.72
        },
      ]
    }
};

vecs["1501(short)"] = {
  "params": { "game": "z1501" },
  "darts": [
    [
      [ "T20",  "T20",  "T20" ],
      [ "T20",  "T20",  "T20" ],
      [ "T20",  "T20",  "T20" ],
      [ "T20",  "T20",  "T20" ],
      [ "T20",  "T20",  "T20" ],
      [ "T20",  "T20",  "T20" ],
      [ "T20",  "T20",  "T20" ],
      [ "T20",  "T20",  "T20" ],
      [ "IS01", "T20" ],
      ],
    ],
  "exps": {
    "result": [
      { "darts": 26,
        "winner": { win: true, value: "<span>WONDERFUL!!</span>" },
        "score": 0,
        "awards": { "ton80": 8 },
        "stats": 57.73
        },
      ]
    }
};

vecs["big_bull"] = {
  "params": { "game": "big_bull" },
  "darts": [
    [
      [ "IS01", "IS02", "IS03" ],
      [ "IS04", "IS05", "IS06" ],
      [ "IS07", "IS08", "IS09" ],
      [ "IS10", "IS11", "IS12" ],
      [ "IS13", "IS02", "IS15" ],
      [ "IS16", "IS17", "IS18" ],
      [ "SB",   "SB",   "SB"   ],
      [ "DB",   "DB",   "DB"   ],
      ],
    ],
  "exps": {
    "result": [
      { "darts": 24,
        "winner": { win: true, value: "<span>WONDERFUL!!</span>" },
        "score": 1260,
        "awards": { "hattrick": 6, "black": 2 },
        "stats": 52.50
        },
      ]
    }
};

vecs["bull_shoot"] = {
  "params": { "game": "bull_shoot" },
  "darts": [
    [
      [ "DB",   "DB",   "SB" ],
      [ "SB",   "IS05", "IS06" ],
      [ "IS07", "IS01", "IS09" ],
      [ "IS10", "IS11", "SB"   ],
      [ "DB",   "IS02", "DB"   ],
      [ "SB",   "DB"  , "SB" ],
      [ "SB",   "SB",   "SB"   ],
      [ "DB",   "DB",   "DB"   ],
      ],
    ],
  "exps": {
    "result": [
      { "darts": 24,
        "winner": { win: true, value: "<span>WONDERFUL!!</span>" },
        "score": 600,
        "awards": { "hattrick": 3, "lowton": 1, "black": 1 },
        "stats": 25.00
        },
      ]
    }
};

vecs["yamaguchi_a"] = {
  "params": { "game": "yamaguchi_a" },
  "darts": [
    [
      [ "T20",  "T20",  "T20" ],
      [ "IS20", "T19",  "T19" ],
      [ "T19",  "OS19", "T18" ],
      [ "T18",  "T18",  "OS18" ],
      [ "T17",  "T17",  "T17" ],
      [ "IS17", "T16",  "T16" ],
      [ "T16",  "IS16", "T15" ],
      [ "T15",  "T15",  "OS15" ],
      [ "DB",   "DB",   "DB"  ],
      [ "SB",   "SB",   "SB"  ],
      [ "SB",   "SB",   "SB"  ]
      ],
    [
      [ "T20",  "T20",  "T20" ],
      [ "IS20", "T19",  "T19" ],
      [ "T19",  "OS19", "T18" ],
      [ "T18",  "T18",  "OS18" ],
      [ "T17",  "T17",  "T17" ],
      [ "IS17", "T16",  "T16" ],
      [ "T16",  "IS16", "T15" ],
      [ "T15",  "T15",  "OS15" ],
      [ "DB",   "DB",   "DB"  ],
      [ "SB",   "SB",   "SB"  ],
      [ "SB",   "SB",   "SB"  ]
      ]
    ],
  "exps": {
    "result": [
      { "darts": 31,
        "winner": { win: true, value: "<span>WONDERFUL!!</span>" },
        "score": "100.0 %",
        "awards": { "hattrick": 1, "ton80": 1, "black": 1, "bed": 1, "7mark": 6 },
        "stats": 6.77
        },
      { "darts": 30,
        "winner": { win: false, value: "<span>WONDERFUL!!</span>" },
        "score": "98.6 %",
        "awards": { "hattrick": 1, "ton80": 1, "black": 1, "bed": 1, "7mark": 6 },
        "stats": 6.90 }
      ]
    }
};

vecs["yamaguchi_b"] = {
  "params": { "game": "yamaguchi_b" },
  "darts": [
    [
      [ "IS20", "IS20", "T20" ],
      [ "IS19", "IS19", "T19" ],
      [ "T18",  "T17",  "T16" ],
      [ "IS15", "IS15", "IS15" ],
      [ "T15",  "T17",  "T17" ],
      [ "SB",   "DB" ],
      ],
    [
      [ "IS20", "IS20", "T20" ],
      [ "IS19", "IS19", "T19" ],
      [ "T18",  "T17",  "T16" ],
      [ "IS15", "IS15", "IS15" ],
      [ "T15",  "T17",  "T17" ],
      [ "SB",   "SB",   "SB"  ],
      ]
    ],
  "exps": {
    "result": [
      { "darts": 17,
        "winner": { win: true, value: "<span>GREAT!</span>" },
        "score": "100.0 %",
        "awards": { "whitehorse": 1 },
        "stats": 3.71
        },
      { "darts": 15,
        "winner": { win: false, value: "<span>GREAT!</span>" },
        "score": "85.7 %",
        "awards": { "whitehorse": 1 },
        "stats": 3.60 }
      ]
    }
};

vecs["yamaguchi_c"] = {
  "params": { "game": "yamaguchi_c" },
  "darts": [
    [
      [ "SB",   "SB",   "T20" ],
      [ "T19",  "T18",  "D17" ],
      [ "T16",  "T15",  "D20" ],
      [ "T19",  "T18",  "D17" ],
      [ "T16",  "T15",  "D20" ],
      [ "T19",  "T18",  "D17" ],
      [ "T16",  "T15",  "D20" ],
      [ "T19",  "T18",  "D17" ],
      [ "T16",  "T15",  "D20" ],
      [ "T19",  "T18",  "T17" ],
      [ "T16",  "T15",  "D20" ],
      [ "T19",  "T18",  "D17" ],
      [ "T16",  "T15",  "D20" ],
      [ "T19",  "T18",  "D17" ],
      [ "T16",  "T15",  "D20" ],
      [ "T19",  "T18",  "D17" ],
      [ "T16",  "T15",  "D20" ],
      [ "T19",  "T18",  "D17" ],
      [ "T16",  "T15",  "D20" ],
      [ "SB",   "SB",   "DB"  ],
      ],
    [
      [ "SB",   "SB",   "T20" ],
      [ "T19",  "T18",  "T17" ],
      [ "T16",  "T15",  "T20" ],
      [ "T19",  "T18",  "T17" ],
      [ "T16",  "T15",  "T20" ],
      [ "T19",  "T18",  "T17" ],
      [ "T16",  "T15",  "T20" ],
      [ "T19",  "T18",  "T17" ],
      [ "T16",  "T15",  "T20" ],
      [ "T19",  "T18",  "T17" ],
      [ "T16",  "T15",  "T20" ],
      [ "T19",  "T18",  "T17" ],
      [ "T16",  "T15",  "T20" ],
      [ "T19",  "T18",  "T17" ],
      [ "T16",  "T15",  "T20" ],
      [ "T19",  "T18",  "T17" ],
      [ "T16",  "T15",  "T20" ],
      [ "T19",  "T18",  "T17" ],
      [ "T16",  "T15",  "T20" ],
      [ "SB",   "SB",   "DB"  ],
      ],
    ],
  "exps": {
    "result": [
      { "darts": 60,
        "winner": { win: false, value: "<span>GOOD!</span>" },
        "score": 1,
        "awards": { "8mark": 17, "5mark": 1, "whitehorse": 1 },
        "stats": 7.50
        },
      { "darts": 60,
        "winner": { win: true, value: "<span>WONDERFUL!!</span>" },
        "score": 18,
        "awards": { "5mark": 1, "whitehorse": 18 },
        "stats": 8.35
        }
      ]
    }
};
