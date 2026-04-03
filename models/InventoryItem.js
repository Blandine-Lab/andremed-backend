const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  codeProduit: { type: String, required: true },
  nomMedicament: { type: String, required: true },
  forme: String,
  dosage: String,
  numeroLot: { type: String, required: true },
  datePeremption: { type: Date, required: true },
  emplacement: String,
  fournisseur: String,
  stockInitial: { type: Number, default: 0 },
  entrees: { type: Number, default: 0 },
  sorties: { type: Number, default: 0 },
  stockTheorique: { type: Number, default: 0 },
  stockReel: { type: Number, default: 0 },
  ecart: { type: Number, default: 0 },
  prixUnitaire: { type: Number, default: 0 },
  valeurTotale: { type: Number, default: 0 },
  observations: String,
  month: { type: String, required: true },
  year: { type: Number, required: true },
  qtyExpired: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Calculs automatiques avant sauvegarde (version synchrone, pas de next)
inventoryItemSchema.pre('save', function() {
  this.stockTheorique = this.stockInitial + this.entrees - this.sorties;
  this.ecart = this.stockReel - this.stockTheorique;
  this.valeurTotale = this.stockReel * this.prixUnitaire;
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);