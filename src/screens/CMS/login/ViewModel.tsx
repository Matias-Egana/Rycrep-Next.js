// src/screens/CMS/login/ViewModel.tsx
import { useState } from 'react';
import { CmsLoginUseCase, type CmsLoginResult } from '../../../domain/usecases/CmsLogin';
import { CmsLoginRepository } from '../../../data/repositories/CmsLoginRepository';
import { cmsAuth } from '../../../lib/cmsAuth';

const useCase = new CmsLoginUseCase(new CmsLoginRepository());

export function useCmsLoginVM() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [mfaCode, setMfaCode] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [challengeToken, setChallengeToken] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function resetMfaState() {
    setMfaRequired(false);
    setChallengeToken(null);
    setMfaCode('');
  }

  function validateCredentials() {
    const u = username.trim();
    const p = password.trim();

    if (!u || !p) return 'Usuario y contraseña son obligatorios.';
    return null;
  }

  // 🚀 Paso 1: login con user + password
  async function submitLogin(onSuccess: () => void) {
    const validationError = validateCredentials();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result: CmsLoginResult = await useCase.execute(
        username.trim(),
        password.trim(),
      );

      if (result.status === 'success') {
        resetMfaState();
        onSuccess();
      } else {
        // MFA requerido → mostramos el campo de código
        setMfaRequired(true);
        setChallengeToken(result.challengeToken);
        setMfaCode('');
      }
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión.');
      cmsAuth.clear();
      resetMfaState();
    } finally {
      setLoading(false);
    }
  }

  // 🚀 Paso 2: enviar código MFA
  async function submitMfa(onSuccess: () => void) {
    const code = mfaCode.trim();

    if (!code) {
      setError('Debes ingresar el código MFA.');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError('El código MFA debe tener 6 dígitos.');
      return;
    }

    if (!challengeToken) {
      setError('No hay desafío MFA activo. Intenta iniciar sesión nuevamente.');
      resetMfaState();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await useCase.verifyMfa(challengeToken, code);
      resetMfaState();
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Error al verificar el código MFA.');
    } finally {
      setLoading(false);
    }
  }

  return {
    state: {
      username,
      password,
      showPwd,
      mfaCode,
      mfaRequired,
      error,
      loading,
    },
    setUsername,
    setPassword,
    setShowPwd,
    setMfaCode,
    submitLogin,  
    submitMfa,     
  };
}
