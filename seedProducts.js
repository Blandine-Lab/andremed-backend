require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

connectDB();

const initialProducts = [
  { id: 1, name: "HBSAG (50 Strips/box)", category: "Sérologie", quantity: 100, price: 12, unit: "boite", storageTemp: "", usage: "laboratoire", seuilAlerte: 20, qrCode: `prod_1` },
  { id: 2, name: "HCV (50 Strips/box)", category: "Sérologie", quantity: 100, price: 12, unit: "boite", storageTemp: "", usage: "laboratoire", seuilAlerte: 20, qrCode: `prod_2` },
  { id: 3, name: "SYPHILIS (TP) (50 Strips/box)", category: "Sérologie", quantity: 100, price: 12, unit: "boite", storageTemp: "", usage: "laboratoire", seuilAlerte: 20, qrCode: `prod_3` },
  { id: 4, name: "H. PYLORI Antibody (50 Strips/box)", category: "Sérologie", quantity: 70, price: 20, unit: "boite", storageTemp: "", usage: "laboratoire", seuilAlerte: 15, qrCode: `prod_4` },
  { id: 5, name: "SALMONELLA TYPHOID 25 CA/box", category: "Sérologie", quantity: 50, price: 30, unit: "boite", storageTemp: "", usage: "laboratoire", seuilAlerte: 10, qrCode: `prod_5` },
  { id: 6, name: "CLAMIDIA PNEUMONIAE (25 Cassettes/box)", category: "Sérologie", quantity: 30, price: 40, unit: "boite", storageTemp: "", usage: "laboratoire", seuilAlerte: 10, qrCode: `prod_6` },
  { id: 7, name: "Toxoplasmose (Toxo) 25 card/box", category: "Sérologie", quantity: 15, price: 35, unit: "boite", storageTemp: "", usage: "laboratoire", seuilAlerte: 5, qrCode: `prod_7` },
  { id: 8, name: "Tube EDTA K3PET, 4ml, Size: 13*75mm, 100pc/box", category: "Consommable", quantity: 500, price: 8, unit: "boite", storageTemp: "", usage: "consommable", seuilAlerte: 100, qrCode: `prod_8` },
  { id: 9, name: "Tube SEC, no additive 4ml, Size: 13*75mm, 100pc/box", category: "Consommable", quantity: 500, price: 8, unit: "boite", storageTemp: "", usage: "consommable", seuilAlerte: 100, qrCode: `prod_9` },
  { id: 10, name: "Tube heparine, 4ml, Size: 13*75mm, 100pc/box", category: "Consommable", quantity: 100, price: 8, unit: "boite", storageTemp: "", usage: "consommable", seuilAlerte: 20, qrCode: `prod_10` },
  { id: 11, name: "Chariot de soins en acier inoxydable 66x44x86cm", category: "Equipement", quantity: 3, price: 130, unit: "pièce", storageTemp: "", usage: "Matériel de soins", seuilAlerte: 1, qrCode: `prod_11` },
  { id: 12, name: "Paravent à 4 volets", category: "Equipement", quantity: 5, price: 160, unit: "pièce", storageTemp: "30 - 120 °C", usage: "Matériel", seuilAlerte: 2, qrCode: `prod_12` },
  { id: 13, name: "Paravent à 3 volets", category: "Equipement", quantity: 10, price: 130, unit: "pièce", storageTemp: "31 - 120 °C", usage: "Matériel", seuilAlerte: 3, qrCode: `prod_13` },
  { id: 14, name: "Embouts bleu, 1000μl, 500pcs/box", category: "Consommable", quantity: 150, price: 13, unit: "boite", storageTemp: "2 - 8 °C", usage: "consommable", seuilAlerte: 30, qrCode: `prod_14` },
  { id: 15, name: "Embouts Jaune, 1000μl, 500pcs/box", category: "Consommable", quantity: 200, price: 13, unit: "boite", storageTemp: "2 - 8 °C", usage: "consommable", seuilAlerte: 40, qrCode: `prod_15` },
  { id: 16, name: "Micropipette 10-100μl", category: "Equipement de Laboratoire", quantity: 22, price: 50, unit: "pièce", storageTemp: "2 - 8 °C", usage: "laboratoire", seuilAlerte: 5, qrCode: `prod_16` },
  { id: 17, name: "Micropipette 100-1000μl", category: "Equipement de Laboratoire", quantity: 22, price: 50, unit: "pièce", storageTemp: "2 - 8 °C", usage: "laboratoire", seuilAlerte: 5, qrCode: `prod_17` },
  { id: 18, name: "Micropipette 1000-5000μl", category: "Equipement de Laboratoire", quantity: 6, price: 50, unit: "pièce", storageTemp: "2 - 8 °C", usage: "laboratoire", seuilAlerte: 2, qrCode: `prod_18` },
  { id: 19, name: "Cover Glass(Lamelle) 22*22mm 100pcs/box", category: "Consommable", quantity: 500, price: 1.5, unit: "boite", storageTemp: "2 - 8 °C", usage: "laboratoire", seuilAlerte: 100, qrCode: `prod_19` },
  { id: 20, name: "Microscope Slides (Lame) 50pcs/box", category: "Consommable", quantity: 400, price: 3, unit: "boite", storageTemp: "10 - 30 °C", usage: "laboratoire", seuilAlerte: 80, qrCode: `prod_20` },
  { id: 21, name: "Civière d'ambulance Position haute: 190 x 55 x 50 cm", category: "Equipement d'urgence", quantity: 2, price: 500, unit: "pièce", storageTemp: "", usage: "Urgence", seuilAlerte: 1, qrCode: `prod_21` },
  { id: 22, name: "Stéthoscope Sprague Rappaport 1 pièce/boîte", category: "Equipement", quantity: 50, price: 10, unit: "pièce", storageTemp: "2 - 8 °C", usage: "Matériel", seuilAlerte: 10, qrCode: `prod_22` },
  { id: 23, name: "Stethoscope", category: "Equipement", quantity: 100, price: 6, unit: "pièce", storageTemp: "2 - 8 °C", usage: "Matériel", seuilAlerte: 20, qrCode: `prod_23` },
  { id: 24, name: "Aneroid Sphygmomanometer (Tensiomètre anéroïde)", category: "Equipement", quantity: 50, price: 20, unit: "pièce", storageTemp: "2 - 8 °C", usage: "Matériel", seuilAlerte: 10, qrCode: `prod_24` },
  { id: 25, name: "Infusion Stand height: 2m (Pied à perfusion H: 2m)", category: "Equipement Laboratoire", quantity: 20, price: 30, unit: "pièce", storageTemp: "2 - 8 °C", usage: "Matériel", seuilAlerte: 5, qrCode: `prod_25` },
  { id: 26, name: "Support de pipette", category: "Equipement Laboratoire", quantity: 12, price: 40, unit: "pièce", storageTemp: "2 - 8 °C", usage: "Matériel", seuilAlerte: 3, qrCode: `prod_26` },
  { id: 27, name: "Conteneur Sharpe carré avec poignée 5 L", category: "Consommable", quantity: 72, price: 10, unit: "pièce", storageTemp: "2 - 8 °C", usage: "Matériel", seuilAlerte: 15, qrCode: `prod_27` },
  { id: 28, name: "Conteneur Sharpe carré avec poignée 15 L", category: "Consommable", quantity: 30, price: 14, unit: "pièce", storageTemp: "2 - 8 °C", usage: "Matériel", seuilAlerte: 10, qrCode: `prod_28` },
  { id: 29, name: "Oxymètre de pouls digital Écran OLED", category: "Equipement vital", quantity: 100, price: 10, unit: "pièce", storageTemp: "2 - 8 °C", usage: "Médecine", seuilAlerte: 20, qrCode: `prod_29` },
  { id: 30, name: "Analyseur d'urine", category: "Urologie", quantity: 5, price: 650, unit: "pièce", storageTemp: "2 - 8 °C", usage: "Analyseur", seuilAlerte: 2, qrCode: `prod_30` },
  { id: 31, name: "Bandelette 14A, 100pcs/box", category: "Urologie", quantity: 100, price: 50, unit: "boite", storageTemp: "2 - 8 °C", usage: "Test", seuilAlerte: 20, qrCode: `prod_31` },
  { id: 32, name: "Printer paper", category: "Consommable", quantity: 30, price: 3, unit: "pièce", storageTemp: "2 - 8 °C", usage: "laboratoire", seuilAlerte: 10, qrCode: `prod_32` },
  { id: 33, name: "Tube capillaire", category: "Consommable", quantity: 400, price: 3, unit: "pièce", storageTemp: "", usage: "laboratoire", seuilAlerte: 80, qrCode: `prod_33` },
  { id: 34, name: "Nébulisateur", category: "Medecine interne", quantity: 12, price: 65, unit: "pièce", storageTemp: "", usage: "Médecine", seuilAlerte: 3, qrCode: `prod_34` },
  { id: 35, name: "Blood mixer (Mélangeur de sang)", category: "Laboratoire", quantity: 2, price: 480, unit: "pièce", storageTemp: "", usage: "laboratoire", seuilAlerte: 1, qrCode: `prod_35` },
  { id: 36, name: "Oscillateur ZJZD-III", category: "Laboratoire", quantity: 1, price: 400, unit: "pièce", storageTemp: "", usage: "laboratoire", seuilAlerte: 1, qrCode: `prod_36` },
  { id: 37, name: "Thermoflash", category: "Laboratoire", quantity: 40, price: 50, unit: "pièce", storageTemp: "", usage: "laboratoire", seuilAlerte: 10, qrCode: `prod_37` },
  { id: 38, name: "ECG 6 channels", category: "Cardiologie", quantity: 2, price: 1004, unit: "kit", storageTemp: "", usage: "Cardiologie", seuilAlerte: 1, qrCode: `prod_38` },
  { id: 39, name: "Thermomètre digital axillaire", category: "Laboratoire", quantity: 50, price: 6, unit: "pièce", storageTemp: "", usage: "laboratoire", seuilAlerte: 10, qrCode: `prod_39` },
  { id: 40, name: "Lampe photothérapie", category: "Néonatologie", quantity: 2, price: 639, unit: "kit", storageTemp: "", usage: "Néontologie", seuilAlerte: 1, qrCode: `prod_40` },
  { id: 41, name: "Nébulisateur 50Hz", category: "Medecine interne", quantity: 2, price: 75, unit: "pièce", storageTemp: "", usage: "Médecine", seuilAlerte: 1, qrCode: `prod_41` },
  { id: 42, name: "Autoclave portable 18L", category: "Laboratoire", quantity: 2, price: 750, unit: "pièce", storageTemp: "", usage: "laboratoire", seuilAlerte: 1, qrCode: `prod_42` },
  { id: 43, name: "Concentrateur d'Oxygène 1-5L", category: "Medecine interne", quantity: 1, price: 774, unit: "pièce", storageTemp: "", usage: "Médecine", seuilAlerte: 1, qrCode: `prod_43` },
  { id: 44, name: "Trolley for moniteur patient", category: "Medecine interne", quantity: 1, price: 250, unit: "pièce", storageTemp: "", usage: "Médecine", seuilAlerte: 1, qrCode: `prod_44` }
];

const seedProducts = async () => {
  try {
    await Product.deleteMany({}); // Supprime tous les produits existants
    const products = initialProducts.map(p => ({
      name: p.name,
      category: p.category,
      quantity: p.quantity,
      price: p.price,
      unit: p.unit,
      seuilAlerte: p.seuilAlerte,
      qrCode: p.qrCode,
      storageTemp: p.storageTemp,
      usage: p.usage
    }));
    await Product.insertMany(products);
    console.log(`${products.length} produits importés avec succès`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedProducts();