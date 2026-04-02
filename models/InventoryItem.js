const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  // Référence au produit
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  
  // Informations produit (dénormalisées)
  codeProduit: { type: String, required: true },
  nomMedicament: { type: String, required: true },
  forme: String,
  dosage: String,
  
  // Gestion par lot
  numeroLot: { type: String, required: true },
  datePeremption: { type: Date, required: true },
  emplacement: String,
  fournisseur: String,
  
  // Quantités
  stockInitial: { type: Number, default: 0 },
  entrees: { type: Number, default: 0 },
  sorties: { type: Number, default: 0 },
  stockTheorique: { type: Number, default: 0 },
  stockReel: { type: Number, default: 0 },
  ecart: { type: Number, default: 0 },
  
  // Valeurs financières
  prixUnitaire: { type: Number, default: 0 },
  valeurTotale: { type: Number, default: 0 },
  
  // Observations
  observations: String,
  
  // Contexte
  month: { type: String, required: true },
  year: { type: Number, required: true },
  
  // Anciens champs (conservés)
  qtyExpired: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  
  // Audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Calculs automatiques avant sauvegarde
inventoryItemSchema.pre('save', function(next) {
  this.stockTheorique = this.stockInitial + this.entrees - this.sorties;
  this.ecart = this.stockReel - this.stockTheorique;
  this.valeurTotale = this.stockReel * this.prixUnitaire;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);