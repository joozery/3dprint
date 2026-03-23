const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: 'dcpmrdg7m',
  api_key: '352957711245418',
  api_secret: 'eAzNBmxdaIIFZv7dP2na6mr5onw'
});

fs.writeFileSync('dummy.stl', 'solid test endsolid test', 'utf8');

cloudinary.uploader.upload('dummy.stl', { resource_type: 'raw', folder: '3d-prints' })
  .then(res => {
      console.log('Upload Success:', res.secure_url);
      fs.unlinkSync('dummy.stl');
  })
  .catch(err => {
      console.error('Upload Failed:', err.message || err);
      fs.unlinkSync('dummy.stl');
  });
