const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://root_mongo:pass_mongo123@mongoclusterwpu.eglczmn.mongodb.net/?retryWrites=true&w=majority&appName=mongoClusterWPU";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    /* Cek Koneksi */
    const conn = client.connect();
    if (!conn) {
      return console.log("Koneksi Gagal");
    }

    /* Pilih DB */
    const mahasiswa = client.db("test_mongo").collection("mahasiswa");

    /* Pilih 1 data kedalam tabel mahasiswa */
    // mahasiswa.insertMany([
    //   {
    //     nama: 'AmIn',
    //     email: '01@paslon.com'
    //   },
    //   // {
    //   //   nama: 'PraGib',
    //   //   email: '02@paslon.com'
    //   // },
    //   // {
    //   //   nama: 'GanMud',
    //   //   email: '03@paslon.com'
    //   // },
    // ],
    // (error, result) => {
    //   if(error){
    //     return console.log('Data Gagal Ditambahkan');
    //   }

    //   return console.log(result);
    // });

    /* Menampilkan semua data mahasiswa */
    await mahasiswa
      .find()
      .limit(5)
      .toArray()
      .then((res) => console.table(res))
      .catch((err) => console.error(err));

    /* Mengubah data mahasiswa */
    // const ubah = mahasiswa.updateOne(
    //   {
    //     _id: new ObjectId('65e5df6b1d1298846f87ecf6')
    //   },
    //   {
    //     $set: {
    //       nama: 'Rahul',
    //       email: 'rahul@gmail.com'
    //     },
    //   },
    // )
    // .then((res) => console.log(res))
    // .catch((err) => console.log(err))

    /* Menghapus data mahasiswa */
    // const hapus = mahasiswa.deleteOne(
    //   {
    //     _id: new ObjectId('65e8876e3ef2b8b50a9f7f40')
    //   },
    // )
    // .then((res) => console.log(res))
    // .catch((err) => console.log(err))
  } finally {
    await client.close();
  }
}
run();
