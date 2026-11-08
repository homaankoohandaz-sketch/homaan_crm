/**
 * Spreadsheet-compatible M6 construction model.
 * Preserves every populated row/cell from the supplied workbook.
 * Percentages are stored as fractions (0.75 = 75%); currency values are raw.
 * This is a legacy-formula reproduction, not a validation of municipal rules.
 */
const row = (number, section, label, formula, format = 'number', note = '') =>
  Object.freeze({ number, cell: `C${number}`, section, label, formula, format, note });

export const CONSTRUCTION_EXCEL_ROWS = Object.freeze([
  row(1,'header','project concept','input:projectConcept','text'),
  row(2,'header','consultant manager / contact','input:contactPhone','text'),
  row(4,'header','construction cost and benefit','input:projectType','text'),
  row(5,'projectInfo','Land Area (m²) / متراژ زمین','input:landArea'),
  row(6,'projectInfo','Plot Width (m) / عرض زمین','input:plotWidth'),
  row(7,'projectInfo','Building Regulations / ضابطه ساخت','input:buildingRegulation'),
  row(8,'projectInfo','Ground Coverage / سطح اشغال','input:groundCoveragePercent','percent'),
  row(9,'projectInfo','Buildable Ratio lower / درصد ساخت منفی','input:lowerBuildablePercent','percent'),
  row(10,'projectInfo','Lower Floors / طبقات پایین (محاسباتی)','input:lowerFloorsForFormula'),
  row(11,'projectInfo','Ground Floor / همکف','C5*C8'),
  row(12,'projectInfo','Upper Floors / طبقات بالا','C11*C7'),
  row(13,'projectInfo','Lower Floors / طبقات پایین (نمایشی)','input:displayedLowerFloors','number','این ردیف در فرمول قدیمی C16 استفاده نشده است.'),
  row(14,'projectInfo','Balcony Area / بالکن','input:balconyArea'),
  row(15,'projectInfo','Rooftop Area / فضای مسقف بام','input:rooftopArea'),
  row(16,'projectInfo','Total Floors / مجموع زیربنا','C12+C11+(C5*C9*C10)+C14+C15'),
  row(17,'projectInfo','Efficiency Ratio / درصد مفید','input:efficiencyPercent','percent'),
  row(18,'projectInfo','متراژ مفید هر طبقه','C17*C11'),
  row(20,'projectInfo','Sellable Area / متراژ قابل فروش پایه','C17*C16'),
  row(22,'additionalRatio','Additional Floor Area Ratio / تعداد طبقه مازاد','input:additionalStoreyCount'),
  row(23,'additionalRatio','متراژ تراکم مازاد','C11*C22'),
  row(24,'additionalRatio','کنسول','C6*C22'),
  row(25,'additionalRatio','مجموع ساخت مازاد','C23+C24'),
  row(26,'additionalRatio','پارکینگ','75*C22'),
  row(27,'additionalRatio','انباری','60*C22'),
  row(28,'additionalRatio','متراژ + تراکم مازاد','C16+C25'),
  row(29,'additionalRatio','درصد مدیریت پیمان','input:managementPercent','percent','در نسخه اکسل خالی است و در هیچ فرمولی مصرف نشده است.'),
  row(30,'additionalRatio','قابل فروش','C28*C17+C27+C26-C81'),
  row(32,'participation','درصد سازنده','input:builderPercent','percent'),
  row(33,'participation','درصد مالک','input:ownerPercent','percent'),
  row(35,'participation','متراژ قابل فروش سازنده','C32*C25+C32*C26+C32*C27'),
  row(36,'participation','متراژ قابل فروش مالک','C33*C25+C33*C26+C33*C27'),
  row(38,'constructionCost','Construction Cost / هزینه ساخت هر متر','input:constructionCostPerM2','currency'),
  row(39,'constructionCost','Total Construction Cost / مجموع ساخت','C38*C28+C42+C43+C44+C46','currency','فرمول قدیمی C45 (عوارض پروانه) را در این ردیف وارد نمی‌کند.'),
  row(41,'constructionCost','پرداختی از زمین','input:landPayment','currency','ردیف ورودی در فرمول‌های موجود مصرف نشده است.'),
  row(42,'constructionCost','سهم خدمات','input:servicesCost','currency'),
  row(43,'constructionCost','کارگزار تراکم مازاد','input:extraDensityBrokerCost','currency'),
  row(44,'constructionCost','خدمات مهندسی یا مدیریت','input:engineeringManagementCost','currency'),
  row(45,'constructionCost','عوارض نوسازی یا پروانه','input:permitCost','currency','در فرمول C49 به هزینه زمین افزوده می‌شود.'),
  row(46,'constructionCost','پرداختی به مالک','input:ownerPayment','currency'),
  row(48,'landCost','Land Price per m² / قیمت هر متر زمین','input:landPricePerM2','currency'),
  row(49,'landCost','Total Land Acquisition Cost / کل خرید زمین','C48*C5-C46-C42+C45','currency'),
  row(50,'landCost','مابه‌التفاوت فرایند شهرسازی زمین','input:urbanPlanningDifference','currency','در فرمول‌های موجود مصرف نشده است.'),
  row(51,'landCost','Total Project Cost / کل هزینه پروژه','C49+C39','currency'),
  row(53,'benefit','Sellable Area / متراژ قابل فروش','C30'),
  row(54,'benefit','Sale Price per m² / قیمت هر متر فروش','input:residentialSalePricePerM2','currency'),
  row(55,'benefit','مفید فروش هر طبقه','C54*C18','currency'),
  row(56,'benefit','TTL Capital Return / مجموع برگشت سرمایه پایه','C54*C53','currency'),
  row(57,'additionalRatioBenefit','متراژ قابل فروش با تراکم مازاد سازنده','C54*C35','currency'),
  row(58,'additionalRatioBenefit','متراژ قابل فروش با تراکم مازاد مالک','C54*C36','currency'),
  row(59,'benefit','مجموع فروش با تراکم مازاد','C56+C57+C58+C83','currency'),
  row(60,'benefit','Project Profit / سود پروژه','C59-C51','currency'),
  row(61,'benefit','درصد سود خالص / net income','C60/C70','percent'),
  row(63,'benefit','Offering % of Construction Cost','C39/C51','percent'),
  row(64,'benefit','Offering % of Land Acquisition Cost','C49/C51','percent'),
  row(65,'benefit','Return on Sales (ROS) / درصد سود پروژه','C59/C51-1','percent'),
  row(66,'benefit','درصد از هزینه ساخت','C63','percent'),
  row(67,'benefit','درصد از خرید زمین','C64','percent'),
  row(69,'constructionNetIncome','آورده ساخت / profit construction','C39','currency'),
  row(70,'constructionNetIncome','Profit-to-Construction-Cost Ratio','C63*C59','currency'),
  row(71,'constructionNetIncome','سود خالص از سرمایه در ساخت','C70-C39','currency'),
  row(72,'constructionNetIncome','قدرالسهم و متراژ در سهم ساخت','C66*C53'),
  row(73,'landNetProfit','NET PROFIT OF LAND / درصد سود خالص','C70/C69-1','percent'),
  row(74,'landNetProfit','آورده زمین','C49','currency'),
  row(75,'landNetProfit','سود کلی از سرمایه‌گذاری در زمین','C64*C59','currency'),
  row(76,'landNetProfit','سود خالص از سرمایه‌گذاری در زمین','C75-C49','currency'),
  row(77,'landNetProfit','قدرالسهم و متراژ از سرمایه‌گذاری در زمین','C67*C53'),
  row(78,'landNetProfit','درصد سود خالص زمین','C75/C74-1','percent'),
  row(79,'landNetProfit','مبلغ اجاره بهای ماهانه','C77*input:monthlyRentPerM2','currency'),
  row(80,'landNetProfit','به قرار هر متر 1 میلیون تومان','input:rentNote','text'),
  row(81,'commercial','تجاری','C5*2*C17'),
  row(82,'commercial','قیمت تجاری','input:commercialSalePricePerM2','currency'),
  row(83,'commercial','مجموع فروش تجاری','C82*C81','currency'),
  row(84,'roiAnalysis','هزینه کرد برای زمین','C49','currency'),
  row(85,'roiAnalysis','هزینه کرد برای ساخت','C39','currency'),
  row(86,'roiAnalysis','مجموع هزینه‌ها','C51','currency'),
  row(87,'roiAnalysis','برگشت کلی سرمایه','C59','currency'),
  row(88,'roiAnalysis','برگشت خالص سرمایه','C87-C86','currency'),
  row(89,'roiAnalysis','درصد خالص سود','1-C86/C87','percent'),
  row(90,'roiAnalysis','درصد مشارکت پیشنهادی طبق آورده به آورده','input:participationNote','text'),
  row(91,'roiAnalysis','درصد سهم زمین','C67','percent'),
  row(92,'roiAnalysis','درصد سهم ساخت','C66','percent')
]);

const finite = (value, key) => {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new TypeError(`${key} must be a finite number`);
  return n;
};
const nonNegative = (value, key) => {
  const n = finite(value, key);
  if (n < 0) throw new RangeError(`${key} must be >= 0`);
  return n;
};
const percent = (value, key) => {
  const n = finite(value, key);
  if (n < 0 || n > 100) throw new RangeError(`${key} must be between 0 and 100`);
  return n / 100;
};

export function calculateExcelConstructionModel(input = {}) {
  const v = {
    landArea: nonNegative(input.landArea ?? 0, 'landArea'),
    plotWidth: nonNegative(input.plotWidth ?? 0, 'plotWidth'),
    buildingRegulation: nonNegative(input.buildingRegulation ?? 0, 'buildingRegulation'),
    groundCoverage: percent(input.groundCoveragePercent ?? 0, 'groundCoveragePercent'),
    lowerBuildable: percent(input.lowerBuildablePercent ?? 0, 'lowerBuildablePercent'),
    lowerFloors: nonNegative(input.lowerFloorsForFormula ?? 0, 'lowerFloorsForFormula'),
    displayedLowerFloors: nonNegative(input.displayedLowerFloors ?? 0, 'displayedLowerFloors'),
    balcony: nonNegative(input.balconyArea ?? 0, 'balconyArea'),
    rooftop: nonNegative(input.rooftopArea ?? 0, 'rooftopArea'),
    efficiency: percent(input.efficiencyPercent ?? 0, 'efficiencyPercent'),
    extraCount: nonNegative(input.additionalStoreyCount ?? 0, 'additionalStoreyCount'),
    extraArea: nonNegative(input.additionalStoreyArea ?? 0, 'additionalStoreyArea'),
    consoleArea: nonNegative(input.consoleArea ?? 0, 'consoleArea'),
    parking: nonNegative(input.parkingArea ?? 0, 'parkingArea'),
    storage: nonNegative(input.storageArea ?? 0, 'storageArea'),
    management: percent(input.managementPercent ?? 0, 'managementPercent'),
    builder: percent(input.builderPercent ?? 0, 'builderPercent'),
    owner: percent(input.ownerPercent ?? 0, 'ownerPercent'),
    constructionCost: nonNegative(input.constructionCostPerM2 ?? 0, 'constructionCostPerM2'),
    services: nonNegative(input.servicesCost ?? 0, 'servicesCost'),
    broker: nonNegative(input.extraDensityBrokerCost ?? 0, 'extraDensityBrokerCost'),
    engineering: nonNegative(input.engineeringManagementCost ?? 0, 'engineeringManagementCost'),
    permit: nonNegative(input.permitCost ?? 0, 'permitCost'),
    ownerPayment: nonNegative(input.ownerPayment ?? 0, 'ownerPayment'),
    landPayment: input.landPayment ?? '-',
    landPrice: nonNegative(input.landPricePerM2 ?? 0, 'landPricePerM2'),
    urbanDifference: nonNegative(input.urbanPlanningDifference ?? 0, 'urbanPlanningDifference'),
    residentialPrice: nonNegative(input.residentialSalePricePerM2 ?? 0, 'residentialSalePricePerM2'),
    commercialPrice: nonNegative(input.commercialSalePricePerM2 ?? 0, 'commercialSalePricePerM2'),
    rent: nonNegative(input.monthlyRentPerM2 ?? 0, 'monthlyRentPerM2')
  };
  const c = {};
  // Raw inputs first, matching their spreadsheet cells.
  c.C5=v.landArea; c.C6=v.plotWidth; c.C7=v.buildingRegulation;
  c.C8=v.groundCoverage; c.C9=v.lowerBuildable; c.C10=v.lowerFloors;
  c.C13=v.displayedLowerFloors; c.C14=v.balcony; c.C15=v.rooftop; c.C17=v.efficiency;
  c.C22=v.extraCount; c.C29=v.management; c.C32=v.builder; c.C33=v.owner;
  c.C38=v.constructionCost; c.C41=v.landPayment; c.C42=v.services; c.C43=v.broker;
  c.C44=v.engineering; c.C45=v.permit; c.C46=v.ownerPayment; c.C48=v.landPrice;
  c.C50=v.urbanDifference; c.C54=v.residentialPrice; c.C82=v.commercialPrice;
  c.C81=c.C5*2*c.C17;
  // Area and additional-density formulas.
  c.C11=c.C5*c.C8; c.C12=c.C11*c.C7;
  c.C16=c.C12+c.C11+(c.C5*c.C9*c.C10)+c.C14+c.C15;
  c.C18=c.C17*c.C11; c.C20=c.C17*c.C16;
  c.C23=c.C11*c.C22; c.C24=c.C6*c.C22; c.C25=c.C23+c.C24;
  c.C26=75*c.C22; c.C27=60*c.C22; c.C28=c.C16+c.C25;
  c.C30=c.C28*c.C17+c.C27+c.C26-c.C81;
  c.C35=c.C32*c.C25+c.C32*c.C26+c.C32*c.C27;
  c.C36=c.C33*c.C25+c.C33*c.C26+c.C33*c.C27;
  // Cost, land, and return formulas.
  c.C39=c.C38*c.C28+c.C42+c.C43+c.C44+c.C46;
  c.C49=c.C48*c.C5-c.C46-c.C42+c.C45; c.C51=c.C49+c.C39;
  c.C53=c.C30; c.C55=c.C54*c.C18; c.C56=c.C54*c.C53;
  c.C57=c.C54*c.C35; c.C58=c.C54*c.C36; c.C83=c.C82*c.C81;
  c.C59=c.C56+c.C57+c.C58+c.C83; c.C60=c.C59-c.C51;
  c.C63=c.C51 ? c.C39/c.C51 : 0; c.C64=c.C51 ? c.C49/c.C51 : 0;
  c.C65=c.C51 ? c.C59/c.C51-1 : 0; c.C66=c.C63; c.C67=c.C64;
  c.C69=c.C39; c.C70=c.C63*c.C59; c.C61=c.C70 ? c.C60/c.C70 : 0;
  c.C71=c.C70-c.C39; c.C72=c.C66*c.C53;
  c.C73=c.C69 ? c.C70/c.C69-1 : 0; c.C74=c.C49; c.C75=c.C64*c.C59;
  c.C76=c.C75-c.C49; c.C77=c.C67*c.C53; c.C78=c.C74 ? c.C75/c.C74-1 : 0;
  c.C79=c.C77*v.rent; c.C84=c.C49; c.C85=c.C39; c.C86=c.C51; c.C87=c.C59;
  c.C88=c.C87-c.C86; c.C89=c.C87 ? 1-c.C86/c.C87 : 0; c.C90=input.participationNote ?? '';
  c.C91=c.C67; c.C92=c.C66;
  const warnings=[];
  if (c.C28 > c.C16 && c.C59 >= c.C56+c.C57+c.C58) warnings.push({
    code:'ADDITIONAL_AREA_INCLUDED_TWICE',
    message:'متراژ تراکم مازاد در C28 وارد شده و ارزش سهم آن دوباره در C57 و C58 به فروش کل اضافه می‌شود؛ خروجی دقیقاً مطابق اکسل حفظ شده است.'
  });
  if (c.C30 < c.C20) warnings.push({
    code:'COMMERCIAL_AREA_SUBTRACTED_FROM_SELLABLE',
    message:'متراژ تجاری از قابل فروش کسر شده؛ فروش تجاری در C83 جداگانه محاسبه می‌شود.'
  });
  if (Math.abs(v.builder + v.owner - 1) > 1e-9) warnings.push({code:'PARTICIPATION_TOTAL_NOT_100',message:'مجموع درصد سهم سازنده و مالک برابر ۱۰۰٪ نیست.'});
  if (v.management !== 0) warnings.push({code:'MANAGEMENT_PERCENT_UNUSED',message:'درصد مدیریت پیمان در نسخه اکسل ورودی دارد اما در هیچ فرمولی اعمال نشده است.'});
  if (v.urbanDifference !== 0) warnings.push({code:'URBAN_DIFFERENCE_UNUSED',message:'مابه‌التفاوت شهرسازی در نسخه اکسل وارد محاسبه کل هزینه نشده است.'});
  return Object.freeze({model:'construction-excel-m6-v2',cells:Object.freeze(c),rows:CONSTRUCTION_EXCEL_ROWS,warnings:Object.freeze(warnings),inputs:Object.freeze({...input})});
}
