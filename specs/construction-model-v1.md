# BuildWise Construction Model — Canonical v1

## Status
Canonical calculation model for the Construction module. The displayed Excel-style example is the reference fixture.

## Core formulas
1. Ground floor area = Land Area × Ground Coverage.
2. Upper-floor gross area = Ground Floor Area × Building Regulation / Upper Storey Count.
3. Lower-floor gross area = Land Area × Lower FAR × Lower Floor Count.
4. Base gross area = Ground + Upper + Lower + Balcony + Roof.
5. Extra construction = Extra Storeys × Extra Storey Area + Console + Extra Parking + Extra Storage.
6. Total gross area = Base gross + Extra construction.
7. Total sellable = Total gross × Efficiency.
8. Residential sellable = Total sellable − Commercial sellable area.
9. Base construction cost = Total gross × Construction Cost / m².
10. Construction capital = Base construction cost + services + extra-ratio broker + engineering/permit + renovation + owner payment.
11. Land capital = Land Area × Land Price / m².
12. Total project capital = Construction capital + Land capital.
13. Residential return = Residential sellable × Residential sale price / m².
14. Commercial return = Commercial area × Commercial sale price / m².
15. Total return = Residential return + Commercial return.
16. Construction share = Construction capital ÷ Total project capital.
17. Land share = Land capital ÷ Total project capital.
18. Builder return = Total return × Construction share.
19. Owner return = Total return × Land share.
20. Builder net profit = Builder return − Construction capital.
21. Owner net profit = Owner return − Land capital.
22. Project profit = Total return − Total project capital.
23. Project ROI = Project profit ÷ Total project capital × 100.
24. Builder sellable residential area = Residential sellable × Construction share.
25. Owner sellable residential area = Residential sellable × Land share.

## Reference fixture
Land 210 m²; width 11 m; regulation 3; coverage 70%; lower FAR 75%; lower floors 1; balcony 33; roof 20; efficiency 85%; construction 40,000,000; renovation 3,000,000,000; land 185,000,000/m²; residential sale 180,000,000/m²; commercial 110.25 m² at 400,000,000/m².

Expected:
- Ground = 147 m²
- Upper = 441 m²
- Lower = 157.5 m²
- Gross = 798.5 m²
- Total sellable = 678.725 m²
- Residential sellable = 568.475 m²
- Base construction cost = 31.94B
- Construction capital = 34.94B
- Land capital = 38.85B
- Total project capital = 73.79B
- Residential return = 102.3255B
- Commercial return = 44.1B
- Total return = 146.4255B
- Construction share = 47.3505895%
- Land share = 52.6494105%
- Builder return = 69.333337444B
- Builder net profit = 34.393337444B
- Builder residential sellable = 269.1762637 m²
- Owner residential sellable = 299.2987363 m²
- Owner net profit = 38.242162556B
- Project profit = 72.6355B
- Project ROI = 98.43542485%

## Important source-data discrepancy
The supplied sheet displays Project net income percentage as 105%, but the displayed monetary inputs mathematically produce 98.4354% when defined as Project Profit ÷ Total Project Capital. The application must not silently manufacture 105%; it should flag the discrepancy until the original Excel formula is recovered.
