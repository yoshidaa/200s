var boardmap_old = { 'SB': keymap['S'],   'DB':   keymap['='], 'CH': keymap['\n'],  'MN':  keymap['\t'],
                     'IS20': keymap['3'], 'OS20': keymap['F'], 'D20': keymap['\\'], 'T20': keymap['/'],
                     'IS19': keymap['l'], 'OS19': keymap['9'], 'D19': keymap['n'],  'T19': keymap['A'],
                     'IS18': keymap['s'], 'OS18': keymap['C'], 'D18': keymap['E'],  'T18': keymap['&'],
                     'IS17': keymap['Y'], 'OS17': keymap['m'], 'D17': keymap['$'],  'T17': keymap['f'],
                     'IS16': keymap['e'], 'OS16': keymap['4'], 'D16': keymap['T'],  'T16': keymap['H'],
                     'IS15': keymap['d'], 'OS15': keymap['I'], 'D15': keymap['b'],  'T15': keymap['5'],
                     'IS14': keymap['o'], 'OS14': keymap['L'], 'D14': keymap['*'],  'T14': keymap['_'],
                     'IS13': keymap['U'], 'OS13': keymap['0'], 'D13': keymap['@'],  'T13': keymap['g'],
                     'IS12': keymap['?'], 'OS12': keymap['K'], 'D12': keymap['-'],  'T12': keymap['X'],
                     'IS11': keymap['a'], 'OS11': keymap['1'], 'D11': keymap['r'],  'T11': keymap['D'],
                     'IS10': keymap['t'], 'OS10': keymap['q'], 'D10': keymap['['],  'T10': keymap['%'],
                     'IS09': keymap['i'], 'OS09': keymap['+'], 'D09': keymap['!'],  'T09': keymap['G'],
                     'IS08': keymap['Q'], 'OS08': keymap['R'], 'D08': keymap['P'],  'T08': keymap['c'],
                     'IS07': keymap['.'], 'OS07': keymap['j'], 'D07': keymap['Z'],  'T07': keymap['B'],
                     'IS06': keymap['6'], 'OS06': keymap['W'], 'D06': keymap['O'],  'T06': keymap['p'],
                     'IS05': keymap['2'], 'OS05': keymap[':'], 'D05': keymap['>'],  'T05': keymap['J'],
                     'IS04': keymap['<'], 'OS04': keymap[';'], 'D04': keymap['\''], 'T04': keymap['7'],
                     'IS03': keymap['('], 'OS03': keymap['"'], 'D03': keymap['M'],  'T03': keymap[','],
                     'IS02': keymap['^'], 'OS02': keymap['V'], 'D02': keymap['h'],  'T02': keymap['N'],
                     'IS01': keymap['#'], 'OS01': keymap[']'], 'D01': keymap['k'],  'T01': keymap['8'] };

// map for "7 5 17 4"
// T20: 72("H"), D20: 40("("), IS20: 88("X"), OS20: 42("*")
// SB:  45("-"), DB: 70("F")
var boardmap_org = { "CH": 13, "SB": 45, "DB": 70,
                     "OS20": 42,  "OS01": 106, "OS18": 59,  "OS04": 64,  "OS13": 94,  "OS06": 37,  "OS10": 49,  "OS15": 84,  "OS02": 83,  "OS17": 52,
                     "OS03": 36,  "OS19": 101, "OS07": 68,  "OS16": 62,  "OS08": 55,  "OS11": 110, "OS14": 114, "OS09": 56,  "OS12": 100, "OS05": 51,
                     "IS20": 88,  "IS01": 65,  "IS18": 69,  "IS04": 86,  "IS13": 71,  "IS06": 61,  "IS10": 93,  "IS15": 79,  "IS02": 38,  "IS17": 47,
                     "IS03": 102, "IS19": 98,  "IS07": 111, "IS16": 67,  "IS08": 109, "IS11": 80,  "IS14": 48,  "IS09": 91,  "IS12": 104, "IS05": 77,
                     "D20":  40,  "D01":  108, "D18":  99,  "D04":  74,  "D13":  60,  "D06":  66,  "D10":  115, "D15":  112, "D02":  63,  "D17": 73,
                     "D03":  75,  "D19":  113, "D07":  105, "D16":  107, "D08":  103, "D11":  43,  "D14":  34,  "D09":  76,  "D12":  82,  "D05": 78,
                     "T20":  72,  "T01":  54,  "T18":  90,  "T04":  39,  "T13":  57,  "T06":  97,  "T10":  46,  "T15":  89,  "T02":  85,  "T17": 50,
                     "T03":  116, "T19":  95,  "T07":  81,  "T16":  87,  "T08":  58,  "T11":  33,  "T14":  44,  "T09":  35,  "T12":  53,  "T05": 92 };
