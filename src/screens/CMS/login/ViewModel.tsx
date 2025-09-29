// src/screens/CMS/login/ViewModel.tsx
import { useState } from 'react';
import { CmsLoginUseCase } from '../../../domain/usecases/CmsLogin';
import { CmsLoginRepository } from '../../../data/repositories/CmsLoginRepository';
import { cmsAuth } from '../../../lib/cmsAuth';

const useCase = new CmsLoginUseCase(new CmsLoginRepository());

export function useCmsLoginVM() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!username.trim()) return 'Ingresa tu usuario.';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    return null;
    // (Si quieres validar email/username híbrido, agrega lógica acá)
  }

  async function submit(onSuccess?: () => void) {
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      await useCase.execute(username.trim(), password);
      onSuccess?.();
    } catch (e: any) {
      setError(e?.message || 'Error al iniciar sesión.');
      cmsAuth.clear();
    } finally {
      setLoading(false);
    }
  }

  return {
    state: { username, password, showPwd, error, loading },
    setUsername,
    setPassword,
    setShowPwd,
    submit,
  };
}
