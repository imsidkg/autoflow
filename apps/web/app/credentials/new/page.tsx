'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NewCredentialPage = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [data, setData] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        setError('Invalid JSON in data field.');
        setLoading(false);
        return;
      }

      await axios.post('http://localhost:3002/credentials', {
        name,
        type,
        data: parsedData,
      }, {
        withCredentials: true,
      });
      router.push('/credentials');
    } catch (err) {
      setError('Failed to create credential.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add New Credential</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="My API Key" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <Select onValueChange={setType} value={type}>
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select credential type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="api-key">API Key</SelectItem>
                        <SelectItem value="username-password">Username/Password</SelectItem>
                        <SelectItem value="oauth2">OAuth2</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="data">Data (JSON)</Label>
                <Textarea id="data" placeholder='{ "key": "value" }' value={data} onChange={(e) => setData(e.target.value)} required />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex justify-end mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Credential'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCredentialPage;