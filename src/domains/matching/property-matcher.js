export function scorePropertyMatch(buyer = {}, property = {}) {
  const reasons = [];
  let score = 0;
  let weight = 0;
  const add = (condition, points, reason) => {
    weight += points;
    if (condition) { score += points; reasons.push(reason); }
  };
  if (buyer.region != null) add(String(buyer.region) === String(property.region), 25, 'region_match');
  if (buyer.maxPrice != null && property.price != null) add(Number(property.price) <= Number(buyer.maxPrice), 30, 'budget_match');
  if (buyer.minArea != null && property.area != null) add(Number(property.area) >= Number(buyer.minArea), 15, 'area_match');
  if (buyer.minBedrooms != null && property.bedrooms != null) add(Number(property.bedrooms) >= Number(buyer.minBedrooms), 10, 'bedroom_match');
  if (buyer.propertyType != null) add(String(buyer.propertyType) === String(property.propertyType), 10, 'type_match');
  if (buyer.barter != null) add(Boolean(property.barter) === Boolean(buyer.barter), 10, 'barter_match');
  return { score: weight ? Math.round(score / weight * 100) : 0, reasons, explainable: true };
}
export function rankProperties(buyer, properties = []) {
  return properties.map(property => ({ property, ...scorePropertyMatch(buyer, property) }))
    .sort((a, b) => b.score - a.score);
}
