'use client';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('profile');
      if (raw) setProfile(JSON.parse(raw));
    } catch (e) {}
  }, []);

  function save() {
    localStorage.setItem('profile', JSON.stringify(profile));
    alert('Saved');
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold mb-4'>Profile</h1>
      <div className='space-y-3 max-w-lg'>
        <div>
          <label className='block text-sm'>Name</label>
          <input
            className='w-full p-2 border rounded'
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <label className='block text-sm'>Email</label>
          <input
            className='w-full p-2 border rounded'
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div>
          <label className='block text-sm'>Phone</label>
          <input
            className='w-full p-2 border rounded'
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>
        <div>
          <label className='block text-sm'>Password</label>
          <input
            type='password'
            className='w-full p-2 border rounded'
            value={profile.password}
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
            placeholder='Set a password (stored locally)'
          />
        </div>
        <div>
          <button
            onClick={save}
            className='px-4 py-2 rounded bg-primary text-primary-foreground'
          >
            Save profile
          </button>
        </div>
      </div>
    </div>
  );
}
