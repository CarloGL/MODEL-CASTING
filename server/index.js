const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

const fs = require('fs');

// Asegúrate de que la carpeta de uploads existe
const uploadDir = path.join(__dirname, '/uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
// Middleware para manejar JSON y datos de formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectarse a MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/form-models';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);  // Detener la aplicación si no se puede conectar a la base de datos
});

// Definir almacenamiento para Multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, '/uploads'),
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Model schema
const modelSchema = new mongoose.Schema({
  participationNumber: { type: String, unique: true },
  profilePicture: String,
  fullName: String,
  gender: String,
  age: Number,
  emailAddress: String,
  phoneNumber: String,
  availability: String,
  bio: String,
  experience: String,
  portfolioLink: String,
  walkVideoLink: String,
  measurements: {
    height: Number,
    weight: Number,
    waist: Number,
    hips: Number
  },
  tiktokUsername: String,
  instagramUsername: String,
  status: { type: String, default: 'pending' },
  checkedIn: { type: Boolean, default: false },
  checkInTime: Date,
  checkOutTime: Date
});

const Model = mongoose.model('Model', modelSchema);

// Endpoint para registrar un nuevo modelo
app.post('/register', upload.single('profilePicture'), async (req, res) => {
  const { fullName, gender, age, emailAddress, phoneNumber, availability, bio, experience, portfolioLink, walkVideoLink, height, weight, waist, hips, tiktokUsername, instagramUsername } = req.body;

  try {
    if (!req.file) {
      throw new Error('No profile picture uploaded');
    }

    const participationNumber = await generateParticipationNumber();

    const newModel = new Model({
      participationNumber,
      profilePicture: req.file.filename,
      fullName,
      gender,
      age: Number(age),
      emailAddress,
      phoneNumber,
      availability,
      bio,
      experience,
      portfolioLink,
      walkVideoLink,
      measurements: { 
        height: Number(height), 
        weight: Number(weight), 
        waist: Number(waist), 
        hips: Number(hips) 
      },
      tiktokUsername,
      instagramUsername
    });

    const savedModel = await newModel.save();
    console.log('Model saved:', savedModel);
    res.status(201).json({ message: 'Model registered successfully', participationNumber });
  } catch (err) {
    console.error('Error registering model:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para actualizar el estado del modelo
app.put('/models/:id/status', async (req, res) => {
  const { status } = req.body;

  try {
      const model = await Model.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!model) {
          return res.status(404).json({ error: 'Model not found' });
      }
      console.log('Updated model:', model);
      res.json(model);
  } catch (err) {
      console.error('Error updating model status:', err);
      res.status(500).json({ error: err.message });
  }
});

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../client')));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.delete('/models/:id', async (req, res) => {
  console.log(`Attempting to delete model with id: ${req.params.id}`);
  try {
    console.log('Before deletion attempt');
    const deletedModel = await Model.findByIdAndDelete(req.params.id);
    console.log('After deletion attempt:', deletedModel);
    if (!deletedModel) {
      console.log('Model not found');
      return res.status(404).json({ message: 'Model not found' });
    }
    console.log('Model deleted successfully');
    res.json({ message: 'Model deleted successfully' });
  } catch (err) {
    console.error('Error deleting model:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener todos los modelos
app.get('/models', async (req, res) => {
  try {
      let query = {};
      if (req.query.status) query.status = req.query.status;
      if (req.query.gender) query.gender = new RegExp(req.query.gender, 'i');
      if (req.query.age) query.age = req.query.age;
      if (req.query.participationNumber) query.participationNumber = new RegExp(req.query.participationNumber, 'i');
      if (req.query.fullName) query.fullName = new RegExp(req.query.fullName, 'i');

      const models = await Model.find(query).select('-__v');
      res.json(models);
  } catch (error) {
      console.error('Error al obtener modelos:', error);
      res.status(500).json({ success: false, message: 'Error fetching models' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/model/:id', async (req, res) => {
  try {
      const model = await Model.findById(req.params.id);
      if (!model) {
          return res.status(404).json({ error: 'Model not found' });
      }
      res.json(model);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

async function generateParticipationNumber() {
  try {
    const lastModel = await Model.findOne().sort({ participationNumber: -1 });
    if (!lastModel || !lastModel.participationNumber) {
      return '0001';
    }
    const lastNumber = parseInt(lastModel.participationNumber, 10);
    if (lastNumber >= 3000) {
      throw new Error('Se ha alcanzado el número máximo de participaciones');
    }
    return (lastNumber + 1).toString().padStart(4, '0');
  } catch (error) {
    console.error('Error generating participation number:', error);
    throw error;
  }
}

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Añadir esta nueva ruta en index.js
app.post('/model-checkin', async (req, res) => {
  const { modelId } = req.body;

  try {
      const model = await Model.findById(modelId);

      if (!model) {
          return res.status(404).json({ error: 'Model not found' });
      }

      if (model.checkedIn) {
          return res.status(400).json({ error: 'Model already checked in' });
      }

      model.checkedIn = true;
      model.checkInTime = new Date();
      await model.save();

      res.json({ message: `${model.fullName} checked in successfully` });
  } catch (error) {
      console.error('Error during check-in:', error);
      res.status(500).json({ error: 'An error occurred during check-in' });
  }
});

app.post('/model-cancel-registration/:id', async (req, res) => {
  try {
      const model = await Model.findById(req.params.id);
      if (!model) {
          return res.status(404).json({ error: 'Model not found' });
      }
      model.status = 'cancelled';
      model.checkedIn = false;
      model.checkInTime = null;
      await model.save();
      res.json({ message: `Registration cancelled for ${model.fullName}` });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.post('/model-checkout/:id', async (req, res) => {
  try {
      const model = await Model.findById(req.params.id);
      if (!model) {
          return res.status(404).json({ error: 'Model not found' });
      }
      if (!model.checkedIn) {
          return res.status(400).json({ error: 'Model is not checked in' });
      }
      model.checkedIn = false;
      model.checkOutTime = new Date();
      await model.save();
      res.json({ message: `${model.fullName} checked out successfully` });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});