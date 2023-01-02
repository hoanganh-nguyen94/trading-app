'use strict';

// NOTE: The details of this web worker are not important it's just used to simulate streaming updates in the grid.

// update these to change the number and rate of updates
var UPDATES_PER_MESSAGE = 100;
var MILLISECONDS_BETWEEN_MESSAGES = 300;

// update these to change the size of the data initially loaded into the grid for updating
var BOOK_COUNT = 5;
var TRADE_COUNT = 2;

// add / remove products to change the data set
var PRODUCTS = ["AAA", "AAS", "AAT", "AAV", "ABB", "ABS", "ACB", "ACC", "ACG", "ACL", "ACV", "ADS", "AFX", "AGG", "AGM", "AGR", "AMD", "AMS", "AMV", "ANV", "APF", "APG", "APH", "API", "APP", "APS", "ASM", "ASP", "AST", "BAB", "BAF", "BCA", "BCC", "BCE", "BCG", "BCM", "BDT", "BFC", "BIC", "BID", "BIG", "BII", "BKG", "BLI", "BMC", "BMI", "BMP", "BMS", "BNA", "BOT", "BSG", "BSI", "BSR", "BTD", "BTS", "BVB", "BVG", "BVH", "BVS", "BWE", "C32", "C47", "C4G", "C69", "CAG", "CAP", "CAR", "CBS", "CC1", "CCL", "CDC", "CDN", "CDO", "CEN", "CEO", "CHP", "CIG", "CII", "CKG", "CLC", "CLL", "CLX", "CMG", "CMT", "CMX", "CNG", "CRC", "CRE", "CSC", "CSI", "CSM", "CST", "CSV", "CTC", "CTD", "CTF", "CTG", "CTI", "CTR", "CTS", "CVN", "D2D", "DAG", "DAH", "DBC", "DBD", "DC4", "DCL", "DCM", "DCS", "DDG", "DDV", "DFF", "DGC", "DGT", "DGW", "DHA", "DHC", "DHG", "DHM", "DHT", "DIG", "DL1", "DLG", "DMC", "DNW", "DPG", "DPM", "DPR", "DQC", "DRC", "DRH", "DRI", "DRL", "DS3", "DSC", "DSN", "DST", "DTD", "DTP", "DVG", "DVM", "DVN", "DVP", "DXG", "DXP", "DXS", "EIB", "ELC", "EVE", "EVF", "EVG", "EVS", "FCM", "FCN", "FID", "FIR", "FIT", "FMC", "FOC", "FOX", "FPT", "FRT", "FTM", "FTS", "G36", "GAS", "GDT", "GEE", "GEG", "GEX", "GHC", "GIL", "GKM", "GMC", "GMD", "GMH", "GSP", "GVR", "HAG", "HAH", "HAP", "HAR", "HAX", "HBC", "HBS", "HCD", "HCM", "HD2", "HD6", "HDA", "HDB", "HDC", "HDG", "HHG", "HHP", "HHS", "HHV", "HID", "HII", "HLD", "HMC", "HND", "HNG", "HOM", "HPG", "HPP", "HPX", "HQC", "HSA", "HSG", "HSL", "HT1", "HTG", "HTM", "HTN", "HUB", "HUT", "HVG", "HVH", "HVN", "IBC", "ICN", "ICT", "IDC", "IDI", "IDJ", "IDP", "IDV", "IJC", "ILB", "IMP", "INN", "IPA", "ITA", "ITC", "ITD", "ITQ", "IVS", "JVC", "KBC", "KDC", "KDH", "KHG", "KHP", "KLB", "KLF", "KMR", "KOS", "KPF", "KSB", "KSD", "KSF", "KSH", "KSQ", "KTL", "KVC", "L14", "L18", "LAS", "LBM", "LCG", "LCM", "LDG", "LDP", "LGL", "LHC", "LHG", "LIC", "LIG", "LIX", "LMH", "LPB", "LPT", "LSS", "LTG", "MAC", "MBB", "MBG", "MBS", "MCG", "MCH", "MCM", "MGG", "MHC", "MIG", "MML", "MPC", "MSB", "MSH", "MSN", "MSR", "MST", "MTG", "MWG", "NAB", "NAF", "NAG", "NBB", "NBC", "NBE", "NCT", "NDN", "NED", "NHA", "NHH", "NHV", "NKG", "NLG", "NNC", "NRC", "NSC", "NSH", "NT2", "NTC", "NTL", "NTP", "NVB", "NVL", "OCB", "OCH", "ODE", "OGC", "OIL", "OPC", "ORS", "PAN", "PAS", "PAT", "PBC", "PBP", "PC1", "PDR", "PET", "PFL", "PGB", "PGC", "PGD", "PGN", "PGS", "PGV", "PHC", "PHP", "PHR", "PIT", "PLC", "PLP", "PLX", "PNJ", "POM", "POW", "PPC", "PPH", "PPI", "PPT", "PRE", "PSD", "PSE", "PSH", "PSI", "PSW", "PTB", "PTC", "PTI", "PTL", "PTT", "PV2", "PVA", "PVB", "PVC", "PVD", "PVG", "PVI", "PVL", "PVP", "PVS", "PVT", "PVV", "PVX", "PXI", "PXL", "PXS", "PXT", "QBS", "QCG", "QHD", "QNS", "QTP", "RAL", "RCL", "RDP", "REE", "S55", "S99", "SAB", "SAM", "SAV", "SBA", "SBS", "SBT", "SBV", "SCG", "SCI", "SCR", "SCS", "SD9", "SDA", "SDD", "SDT", "SDV", "SEA", "SFI", "SGB", "SGI", "SGN", "SGP", "SGR", "SGT", "SHB", "SHI", "SHP", "SHS", "SID", "SIP", "SJC", "SJD", "SJF", "SJS", "SKG", "SLS", "SMB", "SMC", "SNZ", "SRA", "SSB", "SSH", "SSI", "SSN", "STB", "STG", "STH", "STK", "SVD", "SWC", "SZB", "SZC", "TAR", "TC6", "TCB", "TCD", "TCH", "TCI", "TCL", "TCM", "TCO", "TCT", "TDC", "TDG", "TDH", "TDM", "TDN", "TDP", "TDT", "TEG", "TGG", "THD", "THG", "TID", "TIG", "TIP", "TIS", "TIX", "TKC", "TKG", "TLD", "TLG", "TLH", "TMS", "TNA", "TNG", "TNH", "TNI", "TNT", "TPB", "TRC", "TSC", "TTA", "TTB", "TTF", "TTH", "TTN", "TV2", "TVB", "TVC", "TVD", "TVN", "TVS", "TYA", "UDC", "UDJ", "VAB", "VC2", "VC3", "VC7", "VCB", "VCG", "VCI", "VCR", "VCS", "VDS", "VEA", "VEC", "VEF", "VFS", "VGC", "VGI", "VGS", "VGT", "VHC", "VHE", "VHG", "VHL", "VHM", "VIB", "VIC", "VIG", "VIP", "VIX", "VJC", "VKC", "VLB", "VLC", "VMS", "VNA", "VNB", "VND", "VNE", "VNF", "VNG", "VNM", "VNP", "VNR", "VNS", "VOC", "VOS", "VPB", "VPD", "VPG", "VPH", "VPI", "VRC", "VRE", "VSC", "VSH", "VTD", "VTO", "VTP", "VTV", "VUA", "VVS", "WSS", "YEG"];

// add / remove portfolios to change the data set
var PORTFOLIOS = ['Aggressive', 'Defensive', 'Income', 'Speculative', 'Hybrid'];

// these are the list of columns that updates go to
var VALUE_FIELDS = [
    'current',
    'previous',
    'pl1',
    'pl2',
    'gainDx',
    'sxPx',
    '_99Out',
];

// a list of the data, that we modify as we go
var globalRowData;

// start the book id's and trade id's at some future random number
var nextBookId = 62472;
var nextTradeId = 24287;
var nextBatchId = 101;

// build up the test data
function createRowData() {
    globalRowData = [];
    var thisBatch = nextBatchId++;
    for (var k = 0; k < BOOK_COUNT; k++) {
        for (var j = 0; j < PORTFOLIOS.length; j++) {
            var portfolio = PORTFOLIOS[j];
            for (var i = 0; i < PRODUCTS.length; i++) {
                var product = PRODUCTS[i];
                var book = 'GL-' + ++nextBookId;
                for (var l = 0; l < TRADE_COUNT; l++) {
                    var trade = createTradeRecord(product, portfolio, book, thisBatch);
                    globalRowData.push(trade);
                }
            }
        }
    }
    // console.log('Total number of records sent to grid = ' + globalRowData.length);
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTradeRecord(product, portfolio, book, batch) {
    var current =
        Math.floor(Math.random() * 10000) + (Math.random() < 0.45 ? 500 : 19000);
    var previous = current + (Math.random() < 0.5 ? 500 : 19000);

    return {
        product: product,
        portfolio: portfolio,
        book: book,
        trade: ++nextTradeId,
        submitterID: randomBetween(10, 1000),
        submitterDealID: randomBetween(10, 1000),
        dealType: Math.random() < 0.2 ? 'Physical' : 'Financial',
        bidFlag: Math.random() < 0.5 ? 'Buy' : 'Sell',
        current: current,
        previous: previous,
        pl1: randomBetween(10000, 30000),
        pl2: randomBetween(8000, 35000),
        gainDx: randomBetween(35000, 1000),
        sxPx: randomBetween(10000, 30000),
        batch: batch,
    };
}

createRowData();

// postMessage({
//     type: 'setRowData',
//     records: globalRowData,
// });

function updateSomeItems(updateCount) {
    var itemsToUpdate = [];
    for (var k = 0; k < updateCount; k++) {
        if (globalRowData.length === 0) {
            continue;
        }
        var indexToUpdate = Math.floor(Math.random() * globalRowData.length);
        var itemToUpdate = globalRowData[indexToUpdate];

        var field = VALUE_FIELDS[Math.floor(Math.random() * VALUE_FIELDS.length)];
        itemToUpdate[field] += randomBetween(-8000, 8200);

        itemsToUpdate.push(itemToUpdate);
    }

    return itemsToUpdate;
}

var latestUpdateId = 0;

function startUpdates(thisUpdateId) {
    // postMessage({
    //     type: 'start',
    //     updateCount: UPDATES_PER_MESSAGE,
    //     interval: MILLISECONDS_BETWEEN_MESSAGES,
    // });

    var intervalId;

    function intervalFunc() {
        // postMessage({
        //     type: 'updateData',
        //     records: updateSomeItems(UPDATES_PER_MESSAGE),
        // });
        if (thisUpdateId !== latestUpdateId) {
            clearInterval(intervalId);
        }
    }

    intervalId = setInterval(intervalFunc, MILLISECONDS_BETWEEN_MESSAGES);
}

latestUpdateId++;
startUpdates(latestUpdateId)
// self.addEventListener('message', function (e) {
//     // used to control start / stop of updates
//     latestUpdateId++;
//     if (e.data === 'start') startUpdates(latestUpdateId);
// });
