# backend/api/constants.py
# Authoritative-source tags should be recorded alongside values in production
EMISSION_FACTORS = {
    "diesel": 3140.0,  # kg CO2 per tonne — <to be replaced with final chosen source>
    "hfo": 3330.0,
    "lng": 2750.0,
    "cng": 2700.0,
    "electric": 0.0,
    "hybrid": 2500.0,
    "petrol": 2310.0
}

CREDIT_RATE_USD_PER_TONNE = 10.0
EMISSION_FACTOR_SOURCE = "IPCC/IMO recommended factors https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://theicct.org/wp-content/uploads/2021/06/Well-to-wake-co2-mar2021-2.pdf&ved=2ahUKEwjVnP2y1puPAxVqVkEAHSb2GeMQFnoECCEQAQ&usg=AOvVaw10TFstoMM3xuGuwqVlsqET"
