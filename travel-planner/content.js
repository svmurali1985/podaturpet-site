/* Original bilingual planning prompts; official links are references, not copied content. */
(function(r){const data={
  "tasks": [
    {
      "id": "documents",
      "stage": 30,
      "en": "Check each traveler’s passport, entry permission and transit-country requirements.",
      "ta": "ஒவ்வொருவரின் பாஸ்போர்ட், நுழைவு அனுமதி, இடைநிறுத்த நாட்டின் விதிகளைச் சரிபாருங்கள்.",
      "route": "both",
      "parents": false,
      "source": "entry"
    },
    {
      "id": "health",
      "stage": 30,
      "en": "Ask your clinician about travel readiness and how to manage medicines across time zones.",
      "ta": "பயணத்திற்கான உடல்நிலை, நேர வித்தியாசத்தில் மருந்து எடுக்கும் முறையை மருத்துவரிடம் கேளுங்கள்.",
      "route": "both",
      "parents": false,
      "source": "medicine"
    },
    {
      "id": "insurance",
      "stage": 30,
      "en": "Compare travel health cover, exclusions and emergency assistance contacts.",
      "ta": "பயண மருத்துவக் காப்பீடு, விலக்குகள், அவசர உதவி எண்களைப் பாருங்கள்.",
      "route": "both",
      "parents": false,
      "source": null
    },
    {
      "id": "parent-route",
      "stage": 30,
      "en": "For parents: choose manageable connections and request airline mobility or language assistance.",
      "ta": "பெற்றோருக்கு: எளிதான இடைநிறுத்தப் பயணத்தைத் தேர்வு செய்து, நடமாட்ட அல்லது மொழி உதவியை விமான நிறுவனத்திடம் கேளுங்கள்.",
      "route": "both",
      "parents": true,
      "source": null
    },
    {
      "id": "india-entry",
      "stage": 30,
      "en": "For India: check the official visa or OCI guidance that applies to your nationality and status.",
      "ta": "இந்தியா செல்ல: உங்கள் குடியுரிமை மற்றும் நிலைக்கான விசா அல்லது OCI விதிகளை அதிகாரப்பூர்வமாகச் சரிபாருங்கள்.",
      "route": "us-in",
      "parents": false,
      "source": "evisa"
    },
    {
      "id": "us-visit",
      "stage": 30,
      "en": "For the USA: review the correct visitor entry documents; a visa is not a guarantee of admission.",
      "ta": "அமெரிக்காவுக்கு: சரியான நுழைவு ஆவணங்களைப் பாருங்கள்; விசா இருந்தாலும் நுழைவு உறுதி அல்ல.",
      "route": "in-us",
      "parents": false,
      "source": "visa"
    },
    {
      "id": "refills",
      "stage": 14,
      "en": "Review medicine supply, original labels and supporting documents with your clinician or pharmacist.",
      "ta": "மருந்தின் அளவு, அசல் லேபிள், தேவையான ஆவணங்களை மருத்துவர் அல்லது மருந்தாளருடன் சரிபாருங்கள்.",
      "route": "both",
      "parents": false,
      "source": "medicine"
    },
    {
      "id": "pickup",
      "stage": 14,
      "en": "Confirm who will meet you, the pickup point and the destination address.",
      "ta": "வரவேற்க வருபவர், சந்திக்கும் இடம், தங்கும் முகவரியை உறுதி செய்யுங்கள்.",
      "route": "both",
      "parents": false,
      "source": null
    },
    {
      "id": "bags",
      "stage": 14,
      "en": "Check baggage allowances and restricted items for every airline and connection.",
      "ta": "ஒவ்வொரு விமான நிறுவனத்திற்கும் இடைநிறுத்தத்திற்கும் பை அளவு மற்றும் தடை செய்யப்பட்ட பொருட்களைச் சரிபாருங்கள்.",
      "route": "both",
      "parents": false,
      "source": "security"
    },
    {
      "id": "parent-card",
      "stage": 14,
      "en": "For parents: write the host’s phone and address on the emergency card and rehearse asking for help.",
      "ta": "பெற்றோருக்கு: வரவேற்பவரின் எண், முகவரியை அவசர அட்டையில் எழுதி, உதவி கேட்பதைப் பழகுங்கள்.",
      "route": "both",
      "parents": true,
      "source": null
    },
    {
      "id": "copies",
      "stage": 7,
      "en": "Keep accessible copies of necessary travel documents separately from the originals. Do not upload them here.",
      "ta": "தேவையான பயண ஆவணங்களின் நகல்களை அசலிலிருந்து தனியாக வைத்துக்கொள்ளுங்கள். இங்கே பதிவேற்ற வேண்டாம்.",
      "route": "both",
      "parents": false,
      "source": null
    },
    {
      "id": "customs",
      "stage": 7,
      "en": "Review destination customs rules before packing food, gifts, plants or other restricted goods.",
      "ta": "உணவு, பரிசு, செடி அல்லது கட்டுப்பாடுள்ள பொருட்களைப் பேக் செய்வதற்கு முன் சுங்க விதிகளைப் பாருங்கள்.",
      "route": "both",
      "parents": false,
      "source": "customs-india"
    },
    {
      "id": "phone",
      "stage": 7,
      "en": "Arrange roaming or a local SIM plan and save important contacts offline.",
      "ta": "ரோமிங் அல்லது உள்ளூர் SIM ஏற்பாடு செய்து முக்கிய எண்களை இணையம் இல்லாமலும் பார்க்கும்படி சேமியுங்கள்.",
      "route": "both",
      "parents": false,
      "source": null
    },
    {
      "id": "checkin",
      "stage": 3,
      "en": "Confirm flight timings, terminals and check-in instructions directly with the airline.",
      "ta": "விமான நேரம், டெர்மினல், check-in வழிமுறைகளை விமான நிறுவனத்திடம் உறுதி செய்யுங்கள்.",
      "route": "both",
      "parents": false,
      "source": null
    },
    {
      "id": "essentials",
      "stage": 3,
      "en": "Pack essential medicines and travel documents where you can reach them during the journey.",
      "ta": "முக்கிய மருந்துகள், ஆவணங்களைப் பயணத்தில் எளிதாக எடுக்குமிடத்தில் வையுங்கள்.",
      "route": "both",
      "parents": false,
      "source": "medicine"
    },
    {
      "id": "print-card",
      "stage": 3,
      "en": "Print an emergency card and share your travel plan directly with a trusted family member.",
      "ta": "அவசர அட்டையை அச்சிட்டு, நம்பகமான குடும்ப உறுப்பினரிடம் பயணத் திட்டத்தை நேரடியாகப் பகிருங்கள்.",
      "route": "both",
      "parents": false,
      "source": null
    },
    {
      "id": "parent-walk",
      "stage": 3,
      "en": "For parents: walk through security, connections, immigration and baggage collection together.",
      "ta": "பெற்றோருக்கு: பாதுகாப்புச் சோதனை, இடைநிறுத்தம், குடியேற்றச் சோதனை, பை எடுக்கும் முறையை விளக்குங்கள்.",
      "route": "both",
      "parents": true,
      "source": null
    },
    {
      "id": "leave",
      "stage": 0,
      "en": "Allow the airport time recommended by your airline; keep documents and emergency contacts ready.",
      "ta": "விமான நிறுவனம் கூறும் நேரத்திற்கு முன்பே விமான நிலையம் செல்லுங்கள்; ஆவணங்கள், அவசர எண்களைத் தயாராக வையுங்கள்.",
      "route": "both",
      "parents": false,
      "source": null
    },
    {
      "id": "screening",
      "stage": 0,
      "en": "Tell security staff about assistance needs and necessary medical items; follow their instructions.",
      "ta": "தேவையான உதவி, மருத்துவப் பொருட்கள் பற்றி பாதுகாப்பு ஊழியர்களிடம் சொல்லி, அவர்களின் வழிமுறையைப் பின்பற்றுங்கள்.",
      "route": "both",
      "parents": false,
      "source": "security"
    },
    {
      "id": "arrival-call",
      "stage": -1,
      "en": "Tell your family you have arrived and confirm the pickup before leaving the terminal.",
      "ta": "வந்துவிட்டதை குடும்பத்தினரிடம் சொல்லி, டெர்மினலை விட்டு வெளியேறும் முன் pickup-ஐ உறுதி செய்யுங்கள்.",
      "route": "both",
      "parents": false,
      "source": null
    },
    {
      "id": "us-i94",
      "stage": -1,
      "en": "For US visitors: check the I-94 admission record and admitted-until date. Visa expiry is not the permitted stay date.",
      "ta": "அமெரிக்கப் பார்வையாளர்கள்: I-94 பதிவையும் தங்க அனுமதித்த கடைசி தேதியையும் பாருங்கள். விசா முடிவுத் தேதி தங்கும் காலத்தின் முடிவு அல்ல.",
      "route": "in-us",
      "parents": false,
      "source": "i94"
    },
    {
      "id": "arrival-medicine",
      "stage": -1,
      "en": "Follow the medicine timing plan agreed with your clinician and keep the emergency card accessible.",
      "ta": "மருத்துவர் கூறிய மருந்து நேரத் திட்டத்தைப் பின்பற்றி, அவசர அட்டையை எளிதாக எடுக்குமிடத்தில் வையுங்கள்.",
      "route": "both",
      "parents": false,
      "source": null
    }
  ],
  "packing": [
    {
      "id": "doc",
      "bag": "personal",
      "en": "Travel document folder",
      "ta": "பயண ஆவணக் கோப்பு",
      "done": false
    },
    {
      "id": "phone",
      "bag": "personal",
      "en": "Phone and charging cable",
      "ta": "போன் மற்றும் சார்ஜிங் கேபிள்",
      "done": false
    },
    {
      "id": "card",
      "bag": "personal",
      "en": "Printed emergency card",
      "ta": "அச்சிட்ட அவசர அட்டை",
      "done": false
    },
    {
      "id": "med",
      "bag": "carry",
      "en": "Essential medicines and supporting documents",
      "ta": "முக்கிய மருந்துகள் மற்றும் ஆவணங்கள்",
      "done": false
    },
    {
      "id": "change",
      "bag": "carry",
      "en": "One change of clothes",
      "ta": "ஒரு மாற்று உடை",
      "done": false
    },
    {
      "id": "glasses",
      "bag": "carry",
      "en": "Glasses / hearing-aid essentials",
      "ta": "கண்ணாடி / கேட்கும் கருவிக்கான பொருட்கள்",
      "done": false
    },
    {
      "id": "clothes",
      "bag": "checked",
      "en": "Weather-appropriate clothing",
      "ta": "காலநிலைக்கு ஏற்ற உடைகள்",
      "done": false
    },
    {
      "id": "toiletries",
      "bag": "checked",
      "en": "Toiletries after checking restrictions",
      "ta": "விதிகளைச் சரிபார்த்த பின் தனிப்பயன் பராமரிப்புப் பொருட்கள்",
      "done": false
    }
  ],
  "sources": [
    {
      "id": "entry",
      "en": "India travel and entry information — US Department of State",
      "ta": "இந்தியப் பயணம் மற்றும் நுழைவு தகவல் — அமெரிக்க வெளியுறவுத்துறை",
      "url": "https://travel.state.gov/en/international-travel/travel-advisories/india.html"
    },
    {
      "id": "evisa",
      "en": "Indian e-Visa — Government of India",
      "ta": "இந்திய e-Visa — இந்திய அரசு",
      "url": "https://indianvisaonline.gov.in/evisa/tvoa.html"
    },
    {
      "id": "visa",
      "en": "US visa expiry and permitted stay — Department of State",
      "ta": "அமெரிக்க விசா முடிவு மற்றும் தங்கும் அனுமதி — வெளியுறவுத்துறை",
      "url": "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/visa-expiration-date.html"
    },
    {
      "id": "i94",
      "en": "I-94 arrival/departure record — USAGov",
      "ta": "I-94 வருகை / புறப்பாடு பதிவு — USAGov",
      "url": "https://www.usa.gov/arrival-departure-record"
    },
    {
      "id": "medicine",
      "en": "Traveling abroad with medicine — CDC",
      "ta": "மருந்துடன் வெளிநாட்டுப் பயணம் — CDC",
      "url": "https://wwwnc.cdc.gov/travel/page/travel-abroad-with-medicine"
    },
    {
      "id": "security",
      "en": "Liquids and screening — TSA (US departures)",
      "ta": "திரவங்கள் மற்றும் பாதுகாப்புச் சோதனை — TSA (அமெரிக்கப் புறப்பாடு)",
      "url": "https://www.tsa.gov/travel/security-screening/liquids-aerosols-gels-rule"
    },
    {
      "id": "us-emergency",
      "en": "Calling 911 — US National 911 Program",
      "ta": "911 அழைப்பது — அமெரிக்க தேசிய 911 திட்டம்",
      "url": "https://www.911.gov/calling-911/"
    },
    {
      "id": "india-emergency",
      "en": "Emergency response 112 — India Ministry of Home Affairs",
      "ta": "112 அவசர உதவி — இந்திய உள்துறை அமைச்சகம்",
      "url": "https://www.mha.gov.in/en/commoncontent/emergency-response-support-system-erss"
    },
    {
      "id": "customs-us",
      "en": "Customs and declarations — US CBP",
      "ta": "சுங்கம் மற்றும் அறிவிப்புகள் — அமெரிக்க CBP",
      "url": "https://www.cbp.gov/travel"
    },
    {
      "id": "customs-india",
      "en": "India customs — CBIC",
      "ta": "இந்திய சுங்கம் — CBIC",
      "url": "https://www.cbic.gov.in/"
    },
    {
      "id": "oci",
      "en": "OCI services — Government of India",
      "ta": "OCI சேவைகள் — இந்திய அரசு",
      "url": "https://ociservices.gov.in/"
    }
  ]
};if(typeof module!=="undefined"&&module.exports)module.exports=data;else r.TravelContent=data;})(typeof globalThis!=="undefined"?globalThis:this);
