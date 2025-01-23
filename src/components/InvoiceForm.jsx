import React, { useState, useRef } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Plus, ArrowLeft, Upload, ChevronDown, ExternalLink, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearUserSession } from '../utils/auth';

const invoiceSchema = Yup.object().shape({
  vendor: Yup.string().required('Required'),
  purchaseOrderNumber: Yup.string().required('Required'),
  invoiceNumber: Yup.string().required('Required'),
  invoiceDate: Yup.string().required('Required'),
  totalAmount: Yup.string().required('Required'),
  paymentTerms: Yup.string().required('Required'),
  invoiceDueDate: Yup.string().required('Required'),
  glPostDate: Yup.string().required('Required'),
  invoiceDescription: Yup.string().required('Required'),
  expenses: Yup.array().of(
    Yup.object().shape({
      amount: Yup.string().required('Required'),
      department: Yup.string().required('Required'),
      account: Yup.string().required('Required'),
      location: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
    })
  ),
  comments: Yup.string(),
});

const initialValues = {
  vendor: '',
  purchaseOrderNumber: '',
  invoiceNumber: '',
  invoiceDate: '',
  totalAmount: '',
  paymentTerms: '',
  invoiceDueDate: '',
  glPostDate: '',
  invoiceDescription: '',
  expenses: [{
    amount: '',
    department: '',
    account: '',
    location: '',
    description: ''
  }],
  comments: ''
};

const departments = [
  { id: 1, name: 'Sales' },
  { id: 2, name: 'Marketing' },
  { id: 3, name: 'Finance' },
  { id: 4, name: 'Operations' },
  { id: 5, name: 'Human Resources' }
];

const accounts = [
  { id: 1, name: '1000 - Cash' },
  { id: 2, name: '2000 - Accounts Payable' },
  { id: 3, name: '3000 - Revenue' },
  { id: 4, name: '4000 - Expenses' },
  { id: 5, name: '5000 - Payroll' }
];

const locations = [
  { id: 1, name: 'New York' },
  { id: 2, name: 'Los Angeles' },
  { id: 3, name: 'Chicago' },
  { id: 4, name: 'Houston' },
  { id: 5, name: 'Phoenix' }
];

const vendors = [
  { id: 1, name: 'A-1 Exterminators', address: '550 Main St., Lynn' },
  { id: 2, name: 'Office Supplies Co.', address: '123 Business Ave., Boston' },
  { id: 3, name: 'Tech Solutions Inc.', address: '456 Innovation Dr., Cambridge' }
];

const purchaseOrders = [
  { id: 'PO-001', description: 'Office Supplies' },
  { id: 'PO-002', description: 'IT Equipment' },
  { id: 'PO-003', description: 'Maintenance Services' }
];

const paymentTerms = [
  { id: 1, name: 'Net 30' },
  { id: 2, name: 'Net 45' },
  { id: 3, name: 'Net 60' },
  { id: 4, name: 'Due on Receipt' }
];

const CommentsSection = () => (
  <>
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 bg-blue-50 rounded">
        <ExternalLink className="h-5 w-5 text-blue-500" />
      </div>
      <h2 className="text-lg font-medium">Comments</h2>
    </div>

    <Field
      name="comments"
      as="textarea"
      placeholder="Add a comment and use @Name to tag someone"
      rows={4}
      className="w-full rounded-md border border-gray-300 px-3 py-2"
    />
  </>
);

const InvoiceDetailsSection = ({ values }) => (
  <>
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 bg-blue-50 rounded">
        <ExternalLink className="h-5 w-5 text-blue-500" />
      </div>
      <h2 className="text-lg font-medium">Invoice Details</h2>
    </div>

    <div>
      <h3 className="font-medium mb-4">General Information</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Purchase Order Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Field
            name="purchaseOrderNumber"
            as="select"
            className="w-full rounded-md border border-gray-300 px-3 py-2 appearance-none"
          >
            <option value="">Select PO Number</option>
            {purchaseOrders.map(po => (
              <option key={po.id} value={po.id}>
                {po.id} - {po.description}
              </option>
            ))}
          </Field>
          <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>

    <div className="mt-6">
      <h3 className="font-medium mb-4">Invoice Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number <span className="text-red-500">*</span>
          </label>
          <Field
            name="invoiceNumber"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Date <span className="text-red-500">*</span>
          </label>
          <Field
            name="invoiceDate"
            type="date"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">$</span>
            <Field
              name="totalAmount"
              type="text"
              placeholder="0.00"
              className="w-full rounded-md border border-gray-300 px-3 py-2 pl-8"
            />
            <span className="absolute right-3 top-2.5 text-gray-500">USD</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Terms <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Field
              name="paymentTerms"
              as="select"
              className="w-full rounded-md border border-gray-300 px-3 py-2 appearance-none"
            >
              <option value="">Select</option>
              {paymentTerms.map(term => (
                <option key={term.id} value={term.name}>
                  {term.name}
                </option>
              ))}
            </Field>
            <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Due Date <span className="text-red-500">*</span>
          </label>
          <Field
            name="invoiceDueDate"
            type="date"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GL Post Date <span className="text-red-500">*</span>
          </label>
          <Field
            name="glPostDate"
            type="date"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
    </div>

    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Invoice Description <span className="text-red-500">*</span>
      </label>
      <Field
        name="invoiceDescription"
        as="textarea"
        rows={3}
        className="w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>

    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Expense Details</h3>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">$ 0.00</span>
          <span className="text-blue-500">$ 0.00</span>
          <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">$</button>
          <button className="text-gray-600">%</button>
        </div>
      </div>

      <FieldArray name="expenses">
        {({ push }) => (
          <div className="space-y-4">
            {values.expenses.map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Line Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Field
                        name={`expenses.${index}.amount`}
                        type="text"
                        placeholder="0.00"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 pl-8"
                      />
                      <span className="absolute right-3 top-2.5 text-gray-500">USD</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Field
                        name={`expenses.${index}.department`}
                        as="select"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 appearance-none"
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </Field>
                      <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Field
                        name={`expenses.${index}.account`}
                        as="select"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 appearance-none"
                      >
                        <option value="">Select Account</option>
                        {accounts.map(account => (
                          <option key={account.id} value={account.name}>
                            {account.name}
                          </option>
                        ))}
                      </Field>
                      <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Field
                        name={`expenses.${index}.location`}
                        as="select"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 appearance-none"
                      >
                        <option value="">Select Location</option>
                        {locations.map(location => (
                          <option key={location.id} value={location.name}>
                            {location.name}
                          </option>
                        ))}
                      </Field>
                      <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name={`expenses.${index}.description`}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => push({
                amount: '',
                department: '',
                account: '',
                location: '',
                description: ''
              })}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
            >
              <Plus className="h-4 w-4" />
              Add Expense Coding
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  </>
);

export const InvoiceForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Vendor Details');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const savedForm = localStorage.getItem('invoiceForm');
  const initialFormValues = savedForm ? JSON.parse(savedForm) : initialValues;

  const handleLogout = () => {
    clearUserSession();
    navigate('/');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Here you can add logic to read and process the file
      const reader = new FileReader();
      reader.onload = (e) => {
        // Process file content
        console.log('File loaded:', e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      // Process dropped file
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Dropped file loaded:', e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-gray-50 min-h-screen">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">Create New Invoice</h1>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex gap-8">
              <button
                className={`pb-4 px-1 ${
                  activeTab === 'Vendor Details'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('Vendor Details')}
              >
                Vendor Details
              </button>
              <button
                className={`pb-4 px-1 ${
                  activeTab === 'Invoice Details'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('Invoice Details')}
              >
                Invoice Details
              </button>
              <button
                className={`pb-4 px-1 ${
                  activeTab === 'Comments'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('Comments')}
              >
                Comments
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <div 
              className="border border-dashed border-gray-300 rounded-lg p-8 bg-white text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <h3 className="text-lg font-medium mb-1">Upload Your Invoice</h3>
              <p className="text-sm text-gray-500 mb-6">
                To auto-populate fields and save time
              </p>
              <div className="w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="64" cy="64" r="64" fill="#0066FF"/>
                  <rect x="44" y="32" width="40" height="64" rx="2" fill="white"/>
                  <path d="M52 48h24M52 56h24M52 64h16" stroke="#00FF00" strokeWidth="2"/>
                  <path d="M64 80l-8-8M64 80l8-8" stroke="#00FF00" strokeWidth="2"/>
                </svg>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
              <button 
                onClick={() => fileInputRef.current.click()}
                className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </button>
              <div className="mt-2">
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Click to upload
                </button>
                <p className="text-sm text-gray-500">or Drag and drop</p>
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected file: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-7">
            <Formik
              initialValues={initialFormValues}
              validationSchema={invoiceSchema}
              onSubmit={(values, { resetForm }) => {
                localStorage.setItem('invoiceForm', JSON.stringify(values));
                resetForm();
                alert('Invoice submitted successfully!');
              }}
            >
              {({ values }) => (
                <Form className="space-y-6">
                  <div className="bg-white rounded-lg p-6">
                    {activeTab === 'Vendor Details' && (
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-50 rounded">
                              <ExternalLink className="h-5 w-5 text-blue-500" />
                            </div>
                            <h2 className="text-lg font-medium">Vendor Details</h2>
                          </div>

                          <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vendor <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Field
                                name="vendor"
                                as="select"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 appearance-none"
                              >
                                <option value="">Select Vendor</option>
                                {vendors.map(vendor => (
                                  <option key={vendor.id} value={vendor.name}>
                                    {vendor.name}
                                  </option>
                                ))}
                              </Field>
                              <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {vendors.find(v => v.name === values.vendor)?.address || ''}
                            </p>
                            {values.vendor && (
                              <button className="text-sm text-blue-500 hover:text-blue-600 mt-1">
                                View Vendor Details
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <InvoiceDetailsSection values={values} />
                        </div>

                        <div className="border-t pt-6">
                          <CommentsSection />
                        </div>
                      </div>
                    )}

                    {activeTab === 'Invoice Details' && (
                      <div className="space-y-6">
                        <InvoiceDetailsSection values={values} />
                      </div>
                    )}

                    {activeTab === 'Comments' && (
                      <div className="space-y-6">
                        <CommentsSection />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button type="button">
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </button>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('invoiceForm', JSON.stringify(values));
                          alert('Draft saved successfully!');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Save as Draft
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Submit & New
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};