import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:3001/mahasiswa';
const formKosong = { nim: '', nama: '', alamat: '', tgl_lahir: '', jurusan: '' };

function App() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(formKosong);
  const [error, setError] = useState('');

  const ambilData = () => {
    axios
      .get(API)
      .then(res => {
        setData(res.data);
        setError('');
      })
      .catch(() => setError('Tidak dapat terhubung ke server. Pastikan backend berjalan di port 3001.'));
  };

  useEffect(() => { ambilData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const tambahData = (e) => {
    e.preventDefault();
    axios
      .post(API, form)
      .then(() => {
        ambilData();
        setForm(formKosong);
      })
      .catch(() => setError('Gagal menambah data. Periksa kembali isian atau koneksi server.'));
  };

  const hapusData = (nim) => {
    if (window.confirm('Yakin hapus data ini?')) {
      axios
        .delete(`${API}/${nim}`)
        .then(() => ambilData())
        .catch(() => setError('Gagal menghapus data.'));
    }
  };

  const formatTanggal = (t) => {
    if (!t) return '-';
    const [y, m, d] = t.slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <h1>Data Mahasiswa</h1>
          <p>Kelola data mahasiswa: tambah, lihat, dan hapus.</p>
        </div>
      </header>

      <main className="container">
        {error && <div className="alert">{error}</div>}

        <section className="card">
          <h2 className="card-title">Tambah Mahasiswa</h2>
          <form onSubmit={tambahData}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="nim">NIM</label>
                <input id="nim" name="nim" placeholder="Contoh: SI123456" value={form.nim} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="nama">Nama</label>
                <input id="nama" name="nama" placeholder="Nama lengkap" value={form.nama} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="alamat">Alamat</label>
                <input id="alamat" name="alamat" placeholder="Alamat tinggal" value={form.alamat} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="tgl_lahir">Tanggal Lahir</label>
                <input id="tgl_lahir" name="tgl_lahir" type="date" value={form.tgl_lahir} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="jurusan">Jurusan</label>
                <input id="jurusan" name="jurusan" placeholder="Contoh: Sistem Informasi" value={form.jurusan} onChange={handleChange} />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Tambah Data</button>
            </div>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Daftar Mahasiswa</h2>
            <span className="badge">{data.length} data</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>NIM</th>
                  <th>Nama</th>
                  <th>Alamat</th>
                  <th>Tgl Lahir</th>
                  <th>Jurusan</th>
                  <th className="col-aksi">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty">Belum ada data mahasiswa.</td>
                  </tr>
                ) : (
                  data.map(m => (
                    <tr key={m.nim}>
                      <td>{m.nim}</td>
                      <td>{m.nama}</td>
                      <td>{m.alamat}</td>
                      <td>{formatTanggal(m.tgl_lahir)}</td>
                      <td>{m.jurusan}</td>
                      <td className="col-aksi">
                        <button className="btn btn-danger" onClick={() => hapusData(m.nim)}>Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;