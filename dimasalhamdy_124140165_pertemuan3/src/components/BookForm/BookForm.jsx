import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './BookForm.css';

const EMPTY = { title: '', author: '', status: 'milik' };

function BookForm({ onSubmitBook, editingBook, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setForm(editingBook
      ? { title: editingBook.title, author: editingBook.author, status: editingBook.status }
      : EMPTY);
    setErrors({});
    setTouched({});
  }, [editingBook]);

  // Fungsi validasi per kolom
  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'title' && !value.trim()) {
      errorMsg = 'Judul buku wajib diisi.';
    } else if (name === 'author' && !value.trim()) {
      errorMsg = 'Nama penulis wajib diisi.';
    }
    return errorMsg;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    // Hapus error secara real-time saat pengguna mulai mengetik kembali
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors((current) => ({ ...current, [name]: errorMsg }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const nextErrors = {
      title: validateField('title', form.title),
      author: validateField('author', form.author)
    };

    setErrors(nextErrors);
    setTouched({ title: true, author: true });

    if (nextErrors.title || nextErrors.author) return;

    onSubmitBook({ title: form.title.trim(), author: form.author.trim(), status: form.status });
    setForm(EMPTY);
    setErrors({});
    setTouched({});
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="form-title-row">
        <h3>{editingBook ? 'Edit Informasi Buku' : 'Tambah Buku Baru'}</h3>
        {editingBook && <span className="editing-label">Mode edit</span>}
      </div>

      {/* Field Judul Buku */}
      <div className={`field ${touched.title && errors.title ? 'has-error' : ''}`}>
        <label htmlFor="book-title">
          Judul buku <span className="required-star">*</span>
        </label>
        <input
          id="book-title"
          name="title"
          value={form.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Contoh: Filosofi Teras"
          aria-invalid={Boolean(touched.title && errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {touched.title && errors.title && (
          <p id="title-error" className="field-error">
            <span className="error-icon">⚠</span> {errors.title}
          </p>
        )}
      </div>

      {/* Field Nama Penulis */}
      <div className={`field ${touched.author && errors.author ? 'has-error' : ''}`}>
        <label htmlFor="book-author">
          Nama penulis <span className="required-star">*</span>
        </label>
        <input
          id="book-author"
          name="author"
          value={form.author}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Contoh: Henry Manampiring"
          aria-invalid={Boolean(touched.author && errors.author)}
          aria-describedby={errors.author ? 'author-error' : undefined}
        />
        {touched.author && errors.author && (
          <p id="author-error" className="field-error">
            <span className="error-icon">⚠</span> {errors.author}
          </p>
        )}
      </div>

      {/* Status Buku */}
      <div className="field">
        <label htmlFor="book-status">Status buku</label>
        <select id="book-status" name="status" value={form.status} onChange={handleChange}>
          <option value="milik">Milik saya</option>
          <option value="baca">Sedang dibaca</option>
          <option value="beli">Ingin dibeli</option>
        </select>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button className="button button-primary" type="submit">
          {editingBook ? 'Simpan Perubahan' : 'Tambah Buku'}
        </button>
        {editingBook && (
          <button className="button button-secondary" type="button" onClick={onCancelEdit}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

BookForm.propTypes = {
  onSubmitBook: PropTypes.func.isRequired,
  editingBook: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired
  }),
  onCancelEdit: PropTypes.func.isRequired
};

BookForm.defaultProps = { editingBook: null };
export default BookForm;