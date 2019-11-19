var mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var medidorSchema = new Schema({
    id: ObjectId,
    idMedidor: {type: String},
    volpos: {type: Number},
	volneg: {type: Number},
    caudal: {type: Number},
	conductividad: {type: Number},
	nivel: {type: Number},
	presion: {type: Number},
    fecha: {type: Date},
	latitud: {type: Number},
	longitud: {type: Number},
	direccion: {type: String},
	descripcion: {type: String},
	username: {type: String}
}, { collection: 'aysa' });

module.exports = mongoose.model('medidores', medidorSchema);
