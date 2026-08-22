import { useState } from 'react';

const initialForm = {
  companyName: '',
  contactPerson: '',
  designation: '',
  contactNumber: '',
  email: ''
};

const fieldLabels = {
  companyName: 'Company Name',
  contactPerson: 'Contact Person',
  designation: 'Designation',
  contactNumber: 'Contact Number',
  email: 'Email ID'
};

function validateForm(form) {
  const errors = {};

  Object.keys(form).forEach((key) => {
    if (!form[key] || !form[key].trim()) {
      errors[key] = `${fieldLabels[key]} is required`;
    }
  });

  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (
    form.contactNumber &&
    !/^[0-9]{10}$/.test(form.contactNumber)
  ) {
    errors.contactNumber = 'Please enter a valid contact number';
  }

  return errors;
}

function DownloadForm({ onSubmit, isLoading, generalError }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validateForm(form));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    setTouched({
      companyName: true,
      contactPerson: true,
      designation: true,
      contactNumber: true,
      email: true
    });

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(form);
    }
  }

  function getError(name) {
    if (touched[name] && errors[name]) return errors[name];
    return null;
  }

  return (
    <form className="download-form" onSubmit={handleSubmit} noValidate>
      {generalError && <div className="alert alert-error">{generalError}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            autoComplete="organization"
            value={form.companyName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. ABC Pvt Ltd"
            className={getError('companyName') ? 'input-error' : ''}
            disabled={isLoading}
          />
          {getError('companyName') && (
            <span className="field-error">{getError('companyName')}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contactPerson">Contact Person</label>
          <input
            id="contactPerson"
            name="contactPerson"
            type="text"
            autoComplete="name"
            value={form.contactPerson}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Full name"
            className={getError('contactPerson') ? 'input-error' : ''}
            disabled={isLoading}
          />
          {getError('contactPerson') && (
            <span className="field-error">{getError('contactPerson')}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="designation">Designation</label>
          <input
            id="designation"
            name="designation"
            type="text"
            autoComplete="organization-title"
            value={form.designation}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Manager"
            className={getError('designation') ? 'input-error' : ''}
            disabled={isLoading}
          />
          {getError('designation') && (
            <span className="field-error">{getError('designation')}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            id="contactNumber"
            name="contactNumber"
            type="tel"
            autoComplete="tel"
            value={form.contactNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. 9876543210"
            className={getError('contactNumber') ? 'input-error' : ''}
            disabled={isLoading}
          />
          {getError('contactNumber') && (
            <span className="field-error">{getError('contactNumber')}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email ID</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="you@company.com"
          className={getError('email') ? 'input-error' : ''}
          disabled={isLoading}
        />
        {getError('email') && (
          <span className="field-error">{getError('email')}</span>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary btn-submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span> Processing...
            </>
          ) : (
            'OK & Download'
          )}
        </button>
      </div>
    </form>
  );
}

export default DownloadForm;
