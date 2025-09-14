"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Credential = {
  id: string;
  type: string;
  name: string;
  data: any;
};

const CredentialsPage = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await axios.get('http://localhost:3002/credentials', {
          withCredentials: true,
        });
        setCredentials(res.data.credentials);
      } catch (err) {
        setError('Failed to fetch credentials. Make sure you are logged in.');
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Credentials</h1>
        <Button asChild>
          <Link href="/credentials/new">Add Credential</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {credentials.map((cred) => (
          <Card key={cred.id}>
            <CardHeader>
              <CardTitle>{cred.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{cred.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {credentials.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="mb-4">You don't have any credentials yet.</p>
          <Button asChild>
            <Link href="/credentials/new">Create one now</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CredentialsPage;
