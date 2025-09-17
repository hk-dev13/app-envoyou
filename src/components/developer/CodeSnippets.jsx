import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Copy,
  Check,
  FileText,
  Key,
  CheckCircle
} from 'lucide-react';

const CodeSnippets = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('verify');
  const [copiedStates, setCopiedStates] = useState({});

  const endpoints = [
    {
      id: 'verify',
      name: 'Data Verification',
      description: 'Verify environmental data',
      icon: CheckCircle,
      color: 'text-emerald-400'
    },
    {
      id: 'data',
      name: 'Get Data',
      description: 'Retrieve environmental data',
      icon: FileText,
      color: 'text-blue-400'
    },
    {
      id: 'auth',
      name: 'Authentication',
      description: 'User authentication',
      icon: Key,
      color: 'text-purple-400'
    }
  ];

  const copyToClipboard = async (language, endpoint) => {
    const code = codeSnippets[language]?.[endpoint] || '';
    try {
      await navigator.clipboard.writeText(code);
      const key = `${language}-${endpoint}`;
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const selectedEndpointData = endpoints.find(e => e.id === selectedEndpoint);
  const EndpointIcon = selectedEndpointData?.icon;

  const codeSnippets = {
    javascript: {
      verify: `// Data Verification Example
const axios = require('axios');

const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.envoyou.com/v1';

async function verifyData(facilityName, location) {
  try {
    const response = await axios.post(\`\${BASE_URL}/verify\`, {
      facility_name: facilityName,
      location: location
    }, {
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Verification result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
verifyData('ABC Manufacturing Plant', {
  latitude: 40.7128,
  longitude: -74.0060
});`,
      data: `// Get Data Example
const axios = require('axios');

const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.envoyou.com/v1';

async function getEnvironmentalData(limit = 10, country = 'US') {
  try {
    const response = await axios.get(\`\${BASE_URL}/data\`, {
      params: {
        limit: limit,
        country: country
      },
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`
      }
    });

    console.log('Data retrieved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
getEnvironmentalData(20, 'US');`,
      auth: `// Authentication Example
const axios = require('axios');

const BASE_URL = 'https://api.envoyou.com/v1';

async function loginUser(email, password) {
  try {
    const response = await axios.post(\`\${BASE_URL}/auth/login\`, {
      email: email,
      password: password
    });

    const { access_token, user } = response.data;
    console.log('Login successful:', user);

    // Store token for future requests
    localStorage.setItem('access_token', access_token);

    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
loginUser('user@example.com', 'password123');`
    },
    python: {
      verify: `# Data Verification Example
import requests
import json

API_KEY = 'your_api_key_here'
BASE_URL = 'https://api.envoyou.com/v1'

def verify_data(facility_name, location):
    url = f"{BASE_URL}/verify"
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'facility_name': facility_name,
        'location': location
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()

        result = response.json()
        print('Verification result:', json.dumps(result, indent=2))
        return result
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')
        if response:
            print(f'Response: {response.text}')
        raise

# Usage
verify_data('ABC Manufacturing Plant', {
    'latitude': 40.7128,
    'longitude': -74.0060
})`,
      data: `# Get Data Example
import requests
import json

API_KEY = 'your_api_key_here'
BASE_URL = 'https://api.envoyou.com/v1'

def get_environmental_data(limit=10, country='US'):
    url = f"{BASE_URL}/data"
    headers = {
        'Authorization': f'Bearer {API_KEY}'
    }
    params = {
        'limit': limit,
        'country': country
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()

        data = response.json()
        print('Data retrieved:', json.dumps(data, indent=2))
        return data
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')
        if response:
            print(f'Response: {response.text}')
        raise

# Usage
get_environmental_data(20, 'US')`,
      auth: `# Authentication Example
import requests
import json

BASE_URL = 'https://api.envoyou.com/v1'

def login_user(email, password):
    url = f"{BASE_URL}/auth/login"
    data = {
        'email': email,
        'password': password
    }

    try:
        response = requests.post(url, json=data)
        response.raise_for_status()

        result = response.json()
        access_token = result.get('access_token')
        user = result.get('user')

        print('Login successful:', json.dumps(user, indent=2))

        # Store token for future requests
        with open('.env', 'a') as f:
            f.write(f'\\nACCESS_TOKEN={access_token}')

        return result
    except requests.exceptions.RequestException as e:
        print(f'Login failed: {e}')
        if response:
            print(f'Response: {response.text}')
        raise

# Usage
login_user('user@example.com', 'password123')`
    },
    curl: {
      verify: `# Data Verification
curl -X POST "https://api.envoyou.com/v1/verify" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "facility_name": "ABC Manufacturing Plant",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }'`,
      data: `# Get Data
curl -X GET "https://api.envoyou.com/v1/data?limit=10&country=US" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      auth: `# Authentication
curl -X POST "https://api.envoyou.com/v1/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'`
    },
    php: {
      verify: `<?php
// Data Verification Example
$apiKey = 'your_api_key_here';
$baseUrl = 'https://api.envoyou.com/v1';

function verifyData($facilityName, $location) {
    $url = $baseUrl . '/verify';
    $data = json_encode([
        'facility_name' => $facilityName,
        'location' => $location
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        throw new Exception('cURL Error: ' . curl_error($ch));
    }

    curl_close($ch);

    if ($httpCode >= 400) {
        throw new Exception("API Error: HTTP $httpCode - $response");
    }

    $result = json_decode($response, true);
    echo 'Verification result: ' . json_encode($result, JSON_PRETTY_PRINT) . PHP_EOL;
    return $result;
}

// Usage
try {
    verifyData('ABC Manufacturing Plant', [
        'latitude' => 40.7128,
        'longitude' => -74.0060
    ]);
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
}
?>`,
      data: `<?php
// Get Data Example
$apiKey = 'your_api_key_here';
$baseUrl = 'https://api.envoyou.com/v1';

function getEnvironmentalData($limit = 10, $country = 'US') {
    $url = $baseUrl . '/data?' . http_build_query([
        'limit' => $limit,
        'country' => $country
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        throw new Exception('cURL Error: ' . curl_error($ch));
    }

    curl_close($ch);

    if ($httpCode >= 400) {
        throw new Exception("API Error: HTTP $httpCode - $response");
    }

    $data = json_decode($response, true);
    echo 'Data retrieved: ' . json_encode($data, JSON_PRETTY_PRINT) . PHP_EOL;
    return $data;
}

// Usage
try {
    getEnvironmentalData(20, 'US');
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
}
?>`,
      auth: `<?php
// Authentication Example
$baseUrl = 'https://api.envoyou.com/v1';

function loginUser($email, $password) {
    $url = $baseUrl . '/auth/login';
    $data = json_encode([
        'email' => $email,
        'password' => $password
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        throw new Exception('cURL Error: ' . curl_error($ch));
    }

    curl_close($ch);

    if ($httpCode >= 400) {
        throw new Exception("Login failed: HTTP $httpCode - $response");
    }

    $result = json_decode($response, true);
    $accessToken = $result['access_token'] ?? null;
    $user = $result['user'] ?? null;

    echo 'Login successful: ' . json_encode($user, JSON_PRETTY_PRINT) . PHP_EOL;

    // Store token for future requests
    file_put_contents('.env', "ACCESS_TOKEN=$accessToken" . PHP_EOL, FILE_APPEND);

    return $result;
}

// Usage
try {
    loginUser('user@example.com', 'password123');
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
}
?>`
    },
    ruby: {
      verify: `# Data Verification Example
require 'net/http'
require 'json'

API_KEY = 'your_api_key_here'
BASE_URL = 'https://api.envoyou.com/v1'

def verify_data(facility_name, location)
  uri = URI("#{BASE_URL}/verify")
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Post.new(uri)
  request['Authorization'] = "Bearer #{API_KEY}"
  request['Content-Type'] = 'application/json'
  request.body = {
    facility_name: facility_name,
    location: location
  }.to_json

  begin
    response = http.request(request)

    if response.code.to_i >= 400
      raise "API Error: #{response.code} - #{response.body}"
    end

    result = JSON.parse(response.body)
    puts 'Verification result:'
    puts JSON.pretty_generate(result)
    result
  rescue => e
    puts "Error: #{e.message}"
    raise
  end
end

# Usage
verify_data('ABC Manufacturing Plant', {
  latitude: 40.7128,
  longitude: -74.0060
})`,
      data: `# Get Data Example
require 'net/http'
require 'json'

API_KEY = 'your_api_key_here'
BASE_URL = 'https://api.envoyou.com/v1'

def get_environmental_data(limit = 10, country = 'US')
  uri = URI("#{BASE_URL}/data")
  uri.query = URI.encode_www_form({
    limit: limit,
    country: country
  })

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Get.new(uri)
  request['Authorization'] = "Bearer #{API_KEY}"

  begin
    response = http.request(request)

    if response.code.to_i >= 400
      raise "API Error: #{response.code} - #{response.body}"
    end

    data = JSON.parse(response.body)
    puts 'Data retrieved:'
    puts JSON.pretty_generate(data)
    data
  rescue => e
    puts "Error: #{e.message}"
    raise
  end
end

# Usage
get_environmental_data(20, 'US')`,
      auth: `# Authentication Example
require 'net/http'
require 'json'

BASE_URL = 'https://api.envoyou.com/v1'

def login_user(email, password)
  uri = URI("#{BASE_URL}/auth/login")
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Post.new(uri)
  request['Content-Type'] = 'application/json'
  request.body = {
    email: email,
    password: password
  }.to_json

  begin
    response = http.request(request)

    if response.code.to_i >= 400
      raise "Login failed: #{response.code} - #{response.body}"
    end

    result = JSON.parse(response.body)
    access_token = result['access_token']
    user = result['user']

    puts 'Login successful:'
    puts JSON.pretty_generate(user)

    # Store token for future requests
    File.open('.env', 'a') do |file|
      file.puts "ACCESS_TOKEN=#{access_token}"
    end

    result
  rescue => e
    puts "Error: #{e.message}"
    raise
  end
end

# Usage
login_user('user@example.com', 'password123')`
    },
    go: {
      verify: `// Data Verification Example
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

const API_KEY = "your_api_key_here"
const BASE_URL = "https://api.envoyou.com/v1"

type Location struct {
    Latitude  float64 \`json:"latitude"\`
    Longitude float64 \`json:"longitude"\`
}

type VerifyRequest struct {
    FacilityName string   \`json:"facility_name"\`
    Location     Location \`json:"location"\`
}

func verifyData(facilityName string, location Location) (map[string]interface{}, error) {
    url := BASE_URL + "/verify"

    reqData := VerifyRequest{
        FacilityName: facilityName,
        Location:     location,
    }

    jsonData, err := json.Marshal(reqData)
    if err != nil {
        return nil, fmt.Errorf("error marshaling JSON: %v", err)
    }

    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, fmt.Errorf("error creating request: %v", err)
    }

    req.Header.Set("Authorization", "Bearer "+API_KEY)
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, fmt.Errorf("error making request: %v", err)
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, fmt.Errorf("error reading response: %v", err)
    }

    if resp.StatusCode >= 400 {
        return nil, fmt.Errorf("API error: %d - %s", resp.StatusCode, string(body))
    }

    var result map[string]interface{}
    if err := json.Unmarshal(body, &result); err != nil {
        return nil, fmt.Errorf("error parsing JSON: %v", err)
    }

    fmt.Println("Verification result:", result)
    return result, nil
}

func main() {
    location := Location{
        Latitude:  40.7128,
        Longitude: -74.0060,
    }

    result, err := verifyData("ABC Manufacturing Plant", location)
    if err != nil {
        fmt.Printf("Error: %v\\n", err)
        return
    }

    fmt.Printf("Success: %+v\\n", result)
}`,
      data: `// Get Data Example
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "strconv"
)

const API_KEY = "your_api_key_here"
const BASE_URL = "https://api.envoyou.com/v1"

func getEnvironmentalData(limit int, country string) (map[string]interface{}, error) {
    url := fmt.Sprintf("%s/data?limit=%d&country=%s", BASE_URL, limit, country)

    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        return nil, fmt.Errorf("error creating request: %v", err)
    }

    req.Header.Set("Authorization", "Bearer "+API_KEY)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, fmt.Errorf("error making request: %v", err)
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, fmt.Errorf("error reading response: %v", err)
    }

    if resp.StatusCode >= 400 {
        return nil, fmt.Errorf("API error: %d - %s", resp.StatusCode, string(body))
    }

    var data map[string]interface{}
    if err := json.Unmarshal(body, &data); err != nil {
        return nil, fmt.Errorf("error parsing JSON: %v", err)
    }

    fmt.Println("Data retrieved:", data)
    return data, nil
}

func main() {
    data, err := getEnvironmentalData(20, "US")
    if err != nil {
        fmt.Printf("Error: %v\\n", err)
        return
    }

    fmt.Printf("Success: %+v\\n", data)
}`,
      auth: `// Authentication Example
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "os"
)

const BASE_URL = "https://api.envoyou.com/v1"

type LoginRequest struct {
    Email    string \`json:"email"\`
    Password string \`json:"password"\`
}

type LoginResponse struct {
    AccessToken string                 \`json:"access_token"\`
    User        map[string]interface{} \`json:"user"\`
}

func loginUser(email, password string) (*LoginResponse, error) {
    url := BASE_URL + "/auth/login"

    reqData := LoginRequest{
        Email:    email,
        Password: password,
    }

    jsonData, err := json.Marshal(reqData)
    if err != nil {
        return nil, fmt.Errorf("error marshaling JSON: %v", err)
    }

    resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, fmt.Errorf("error making request: %v", err)
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, fmt.Errorf("error reading response: %v", err)
    }

    if resp.StatusCode >= 400 {
        return nil, fmt.Errorf("login failed: %d - %s", resp.StatusCode, string(body))
    }

    var result LoginResponse
    if err := json.Unmarshal(body, &result); err != nil {
        return nil, fmt.Errorf("error parsing JSON: %v", err)
    }

    fmt.Printf("Login successful: %+v\\n", result.User)

    // Store token for future requests
    file, err := os.OpenFile(".env", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    if err != nil {
        return nil, fmt.Errorf("error opening .env file: %v", err)
    }
    defer file.Close()

    if _, err := file.WriteString(fmt.Sprintf("\\nACCESS_TOKEN=%s", result.AccessToken)); err != nil {
        return nil, fmt.Errorf("error writing to .env file: %v", err)
    }

    return &result, nil
}

func main() {
    result, err := loginUser("user@example.com", "password123")
    if err != nil {
        fmt.Printf("Error: %v\\n", err)
        return
    }

    fmt.Printf("Success: %+v\\n", result)
}`
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary-foreground">Code Snippets</h2>
          <p className="text-muted-foreground mt-1">Ready-to-use code examples in multiple languages</p>
        </div>
        <Badge variant="secondary" className="bg-primary/20 text-emerald-400 border-emerald-600/30">
          <Code2 className="h-3 w-3 mr-1" />
          6 Languages
        </Badge>
      </div> */}

      {/* Endpoint Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {endpoints.map((endpoint) => {
          const Icon = endpoint.icon;
          const isSelected = selectedEndpoint === endpoint.id;

          return (
            <Card
              key={endpoint.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? 'bg-card/80 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                  : 'bg-card/50 border-border hover:border-slate-600'
              }`}
              onClick={() => setSelectedEndpoint(endpoint.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-slate-700/50'}`}>
                    <Icon className={`h-5 w-5 ${endpoint.color}`} />
                  </div>
                  <div>
                    <CardTitle className={`text-lg ${isSelected ? 'text-emerald-400' : 'text-primary-foreground'}`}>
                      {endpoint.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {endpoint.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Code Tabs */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {EndpointIcon && <EndpointIcon className={`h-5 w-5 ${selectedEndpointData?.color}`} />}
              <div>
                <CardTitle className="text-primary-foreground">
                  {selectedEndpointData?.name} Example
                </CardTitle>
                <CardDescription>
                  Implementation in different programming languages
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-muted-foreground border-slate-600">
              Don&apos;t forget to replace YOUR_API_KEY
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-background/50">
              <TabsTrigger value="javascript" className="text-xs">JavaScript</TabsTrigger>
              <TabsTrigger value="python" className="text-xs">Python</TabsTrigger>
              <TabsTrigger value="curl" className="text-xs">cURL</TabsTrigger>
              <TabsTrigger value="php" className="text-xs">PHP</TabsTrigger>
              <TabsTrigger value="ruby" className="text-xs">Ruby</TabsTrigger>
              <TabsTrigger value="go" className="text-xs">Go</TabsTrigger>
            </TabsList>

            {['javascript', 'python', 'curl', 'php', 'ruby', 'go'].map((language) => (
              <TabsContent key={language} value={language} className="mt-4">
                <div className="relative">
                  <div className="flex items-center justify-between p-3 bg-background/50 border border-slate-600 rounded-t-lg">
                    <span className="text-sm text-muted-foreground capitalize">{language}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(language, selectedEndpoint)}
                      className="text-muted-foreground hover:text-primary-foreground hover:bg-slate-700/50"
                    >
                      {copiedStates[`${language}-${selectedEndpoint}`] ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="bg-background/50 p-4 rounded-b-lg border-x border-b border-slate-600 overflow-x-auto text-sm">
                    <code className="text-slate-300 font-mono leading-relaxed">
                      {codeSnippets[language]?.[selectedEndpoint] || 'Code snippet not available for this language/endpoint combination.'}
                    </code>
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            {/* <Zap className="h-5 w-5 mr-2 text-yellow-400" /> */}
            Quick Start Guide
          </CardTitle>
          <CardDescription>
            Get up and running with the Envoyou API in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-medium text-primary-foreground mb-2">Get Your API Key</h4>
                  <p className="text-slate-300 mb-3">
                    Create an API key from the API Keys section. You&apos;ll need this for authentication.
                  </p>
                  <div className="bg-background/50 p-3 rounded border border-slate-600">
                    <code className="text-emerald-400 text-sm font-mono">
                      Authorization: Bearer YOUR_API_KEY
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-medium text-primary-foreground mb-2">Make Your First Request</h4>
                  <p className="text-slate-300 mb-3">
                    Use the code snippets above to make your first API call. Start with authentication.
                  </p>
                  <div className="bg-background/50 p-3 rounded border border-slate-600">
                    <code className="text-blue-400 text-sm font-mono">
                      POST /v1/auth/login
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-medium text-primary-foreground mb-2">Monitor Rate Limits</h4>
                  <p className="text-slate-300 mb-3">
                    Keep an eye on your usage in the Analytics section. Respect rate limits to avoid throttling.
                  </p>
                  <div className="bg-background/50 p-3 rounded border border-slate-600">
                    <code className="text-yellow-400 text-sm font-mono">
                      X-RateLimit-Remaining: 999
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="text-lg font-medium text-primary-foreground mb-2">Handle Errors</h4>
                  <p className="text-slate-300 mb-3">
                    Always handle API errors gracefully. Check response status and error messages.
                  </p>
                  <div className="bg-background/50 p-3 rounded border border-slate-600">
                    <code className="text-red-400 text-sm font-mono">
                      {`{ "error": "Invalid API key" }`}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeSnippets;