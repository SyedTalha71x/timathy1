import Mac1 from '../../../public/macronutrient-images/h1.svg'
import Mac2 from '../../../public/macronutrient-images/h2.svg'
import Mac3 from '../../../public/macronutrient-images/h3.svg'
import Mac4 from '../../../public/macronutrient-images/h4.svg'
import Mac5 from '../../../public/macronutrient-images/h5.svg'
import Mac6 from '../../../public/macronutrient-images/h6.svg'

export  const micronutrients = [
    {
      id: 1,
      name: "Vitamin D",
      type: "vitamin",
      scientificName: "Cholecalciferol",
      status: "adequate",
      current: 2.1,
      targetMin: 1.7,
      targetMax: 2.2,
      unit: "mg/dL",
      critical: false,
      description: "Essential for bone health and immune function.",
      icon: Mac4,
      color: "#75C2771A"
    },
    {
      id: 2,
      name: "Vitamin B12",
      type: "vitamin",
      scientificName: "Cobalamin",
      status: "low",
      current: 1.5,
      targetMin: 1.7,
      targetMax: 2.2,
      unit: "mg/dL",
      critical: true,
      description: "Critical for red blood cell formation and DNA synthesis.",
      icon: Mac6,
      color: "#75C2771A"
    },
    {
      id: 3,
      name: "Vitamin C",
      type: "vitamin",
      scientificName: "Ascorbic Acid",
      status: "adequate",
      current: 2.0,
      targetMin: 1.7,
      targetMax: 2.2,
      unit: "mg/dL",
      critical: false,
      description: "Supports skin, blood vessels, and weight-bearing.",
      icon: Mac3,
      color: "#75C2771A"
    },
    {
      id: 4,
      name: "Magnesium",
      type: "mineral",
      scientificName: "Serum",
      status: "adequate",
      current: 2.1,
      targetMin: 1.7,
      targetMax: 2.2,
      unit: "mg/dL",
      critical: false,
      description: "Trusted in over 300 biochemical reactions in the body.",
      icon: Mac1,
      color: "#75C2771A"
    },
    {
      id: 5,
      name: "Iron",
      type: "mineral",
      scientificName: "Serum Iron",
      status: "low",
      current: 1.3,
      targetMin: 1.7,
      targetMax: 2.2,
      unit: "mg/dL",
      critical: true,
      description: "Essential for oxygen transport in the blood.",
      icon: Mac5,
      color: "#75C2771A"
    },
    {
      id: 6,
      name: "Zinc",
      type: "mineral",
      scientificName: "Plasma",
      status: "adequate",
      current: 2.0,
      targetMin: 1.7,
      targetMax: 2.2,
      unit: "mg/dL",
      critical: false,
      description: "Helps the immune system and metabolic function.",
      icon: Mac2,
      color: "#75C2771A"
    }
  ];