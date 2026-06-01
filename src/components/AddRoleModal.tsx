import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useToast';
import { CAPABILITIES, PRODUCTS } from '@/data/products';
import type { CapabilityGrant, ProductId } from '@/types';
import { Drawer } from './Drawer';
import { CapabilityMatrix } from './CapabilityMatrix';

interface AddRoleModalProps {
  onClose: () => void;
  initialProduct?: ProductId | null;
}

export function AddRoleModal({ onClose, initialProduct }: AddRoleModalProps) {
  const addRole = useStore((s) => s.addRole);

  const [step, setStep] = useState<1 | 2>(1);
  const [product, setProduct] = useState<ProductId | null>(initialProduct ?? null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capabilities, setCapabilities] = useState<CapabilityGrant[]>([]);

  const productCapabilities = product ? CAPABILITIES.filter((c) => c.product === product) : [];

  function pickProduct(p: ProductId) {
    if (product !== p) {
      setProduct(p);
      setCapabilities([]);
    }
  }

  function goToCapabilities() {
    if (!product) return toast('Select a product', 'error');
    if (!name.trim()) return toast('Enter a role name', 'error');
    setStep(2);
  }

  function handleSubmit() {
    if (capabilities.length === 0) return toast('Select at least one capability action', 'error');
    addRole({ product: product!, name: name.trim(), description: description.trim(), capabilities });
    toast(`Created custom role "${name.trim()}"`, 'success');
    onClose();
  }

  return (
    <Drawer
      title="Create custom role"
      subtitle={`Step ${step} of 2 — ${step === 1 ? 'Role details' : 'Capabilities'}`}
      onClose={onClose}
      size="lg"
      footer={
        step === 1 ? (
          <div className="flex gap-8">
            <button className="btn" type="button" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" type="button" onClick={goToCapabilities}>Next: Capabilities</button>
          </div>
        ) : (
          <div className="flex gap-8">
            <button className="btn" type="button" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-primary" type="button" onClick={handleSubmit}>Create role</button>
          </div>
        )
      }
    >
      {step === 1 ? (
        <>
          <div className="label-text" style={{ marginBottom: 6 }}>Product</div>
          <div className="help" style={{ marginBottom: 8 }}>
            Roles and their capabilities are defined per product.
          </div>
          <div className="radio-group">
            {PRODUCTS.map((p) => {
              const checked = product === p.id;
              return (
                <label
                  key={p.id}
                  className={`radio-card ${checked ? 'checked' : ''}`}
                  onClick={() => pickProduct(p.id)}
                >
                  <input type="radio" name="role-product" checked={checked} onChange={() => pickProduct(p.id)} />
                  <div>
                    <div className="radio-title">{p.name}</div>
                    <div className="radio-sub">{p.description}</div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="section-divider" />

          <label className="field">
            <span className="label-text">Role name</span>
            <input
              className="input"
              placeholder="e.g. Regional Cert Operator"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            <span className="label-text">Description</span>
            <input
              className="input"
              placeholder="What is this role for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </>
      ) : (
        <>
          <div className="label-text" style={{ marginBottom: 6 }}>Capabilities</div>
          <div className="help" style={{ marginBottom: 8 }}>
            Choose which actions <strong>{name.trim() || 'this role'}</strong> can perform on each
            service for {product}. Tick a service name to grant all of its actions.
          </div>
          <CapabilityMatrix
            capabilities={productCapabilities}
            value={capabilities}
            onChange={setCapabilities}
          />
        </>
      )}
    </Drawer>
  );
}
