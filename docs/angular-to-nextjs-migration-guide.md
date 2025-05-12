# Angular to Next.js Migration Guide for Global Remit Teller

This guide outlines the process of migrating components, services, and features from an Angular project to our Next.js application. It covers key considerations, patterns, and best practices to ensure a smooth transition while maintaining consistency with our established architecture.

## Table of Contents

1. [Architecture Differences](#architecture-differences)
2. [Component Migration](#component-migration)
3. [State Management](#state-management)
4. [Services & API Calls](#services--api-calls)
5. [Routing](#routing)
6. [Forms](#forms)
7. [Authentication](#authentication)
8. [Styling](#styling)
9. [Testing](#testing)
10. [Performance Considerations](#performance-considerations)

## Architecture Differences

### Angular vs Next.js

| Angular | Next.js |
|---------|---------|
| Component-based architecture with modules | Component-based architecture with file-based routing |
| Services for state management and API calls | React hooks and context for state, custom hooks for API calls |
| NgModules for code organization | Directory-based organization with App Router |
| Angular Material or custom components | Custom UI components with Radix UI primitives |
| RxJS for reactive programming | React Query for data fetching, useState/useReducer for local state |
| TypeScript with decorators | TypeScript with interfaces and types |
| Angular Router | Next.js App Router |
| NgRx for global state | Context API or Redux Toolkit for global state |

## Component Migration

### Basic Component Structure

**Angular Component:**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent {
  @Input() client: Client;
  @Output() selectClient = new EventEmitter<Client>();

  handleSelect(): void {
    this.selectClient.emit(this.client);
  }
}
```

**Next.js Component:**
```tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Client } from '@/types';

interface ClientCardProps {
  client: Client;
  onSelectClient: (client: Client) => void;
}

export function ClientCard({ client, onSelectClient }: ClientCardProps) {
  const handleSelect = () => {
    onSelectClient(client);
  };

  return (
    <Card className="card-ios">
      <CardContent className="p-4">
        <h3 className="font-medium">{client.name}</h3>
        <p className="text-sm text-muted-foreground">{client.id}</p>
        <Button onClick={handleSelect} className="mt-2">
          Select
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Key Migration Steps

1. **Identify Component Responsibilities**
   - Analyze what the Angular component does
   - Identify inputs, outputs, and internal state
   - Map Angular lifecycle hooks to React hooks

2. **Create Component Structure**
   - Create a new TypeScript/TSX file following our naming conventions
   - Define props interface (equivalent to @Input and @Output)
   - Set up local state with useState or useReducer

3. **Migrate Template Logic**
   - Convert Angular template syntax to JSX
   - Replace *ngIf with conditional rendering
   - Replace *ngFor with array.map()
   - Replace Angular pipes with JavaScript functions

4. **Migrate Component Logic**
   - Convert Angular services to custom hooks
   - Replace lifecycle hooks with useEffect
   - Implement event handlers

## State Management

### Local State

**Angular:**
```typescript
export class ClientListComponent {
  selectedClient: Client | null = null;
  
  selectClient(client: Client): void {
    this.selectedClient = client;
  }
}
```

**Next.js:**
```tsx
export function ClientList() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };
  
  // ...
}
```

### Global State

**Angular (NgRx):**
```typescript
// actions.ts
export const loadClients = createAction('[Clients] Load');
export const loadClientsSuccess = createAction(
  '[Clients] Load Success',
  props<{ clients: Client[] }>()
);

// reducer.ts
export const clientsReducer = createReducer(
  initialState,
  on(loadClientsSuccess, (state, { clients }) => ({
    ...state,
    clients
  }))
);

// effects.ts
@Injectable()
export class ClientEffects {
  loadClients$ = createEffect(() => 
    this.actions$.pipe(
      ofType(loadClients),
      switchMap(() => 
        this.clientService.getClients().pipe(
          map(clients => loadClientsSuccess({ clients }))
        )
      )
    )
  );
  
  constructor(
    private actions$: Actions,
    private clientService: ClientService
  ) {}
}
```

**Next.js (Context + React Query):**
```tsx
// context/ClientContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Client } from '@/types';
import { getClients } from '@/services/client-service';

interface ClientContextType {
  clients: Client[];
  isLoading: boolean;
  error: Error | null;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });
  
  return (
    <ClientContext.Provider value={{ clients, isLoading, error }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
}
```

## Services & API Calls

### Angular Service

```typescript
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'api/clients';
  
  constructor(private http: HttpClient) {}
  
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }
  
  getClient(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }
  
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }
}
```

### Next.js API Service

```typescript
// services/client-service.ts
import { Client } from '@/types';

const API_URL = '/api/clients';

export async function getClients(): Promise<Client[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  return response.json();
}

export async function getClient(id: string): Promise<Client> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch client with id ${id}`);
  }
  return response.json();
}

export async function createClient(client: Client): Promise<Client> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(client),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create client');
  }
  
  return response.json();
}
```

### Using with React Query

```tsx
// hooks/use-clients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, getClient, createClient } from '@/services/client-service';
import { Client } from '@/types';

export function useGetClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });
}

export function useGetClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => getClient(id),
    enabled: !!id
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (client: Client) => createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });
}
```

## Routing

### Angular Routing

```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/:id', component: ClientDetailComponent },
  { path: 'transactions', component: TransactionListComponent },
  { path: 'transactions/new', component: NewTransactionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### Next.js App Router

```
app/
├── (app)/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── clients/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── transactions/
│   │   ├── page.tsx
│   │   └── new/
│   │       └── page.tsx
│   └── layout.tsx
└── layout.tsx
```

### Route Parameters

**Angular:**
```typescript
@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html'
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.clientService.getClient(id).subscribe(client => {
          this.client = client;
        });
      }
    });
  }
}
```

**Next.js:**
```tsx
// app/(app)/clients/[id]/page.tsx
import { getClient } from '@/services/client-service';

interface ClientDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const client = await getClient(params.id);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{client.name}</h1>
      {/* Client details */}
    </div>
  );
}
```

## Forms

### Angular Reactive Forms

```typescript
@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', Validators.required]
      })
    });
  }
  
  onSubmit(): void {
    if (this.clientForm.valid) {
      console.log(this.clientForm.value);
    }
  }
}
```

### Next.js with React Hook Form and Zod

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z.string().min(1, 'Zip code is required')
  })
});

type ClientFormValues = z.infer<typeof clientSchema>;

export function ClientForm() {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        zipCode: ''
      }
    }
  });
  
  const onSubmit = (data: ClientFormValues) => {
    console.log(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Address</h3>
          
          <FormField
            control={form.control}
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Authentication

### Angular Authentication Service

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
  
  login(username: string, password: string): Observable<User> {
    return this.http.post<User>('/api/auth/login', { username, password })
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
```

### Next.js Authentication Context

```tsx
// context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const userData = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    router.push('/login');
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## Styling

### Angular Styling

```typescript
@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent {
  // ...
}
```

```scss
// client-card.component.scss
.client-card {
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .client-name {
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .client-id {
    color: #666;
    font-size: 14px;
  }
  
  .select-button {
    margin-top: 12px;
    background-color: #0A84FF;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: darken(#0A84FF, 10%);
    }
  }
}
```

### Next.js with Tailwind CSS

```tsx
export function ClientCard({ client, onSelectClient }: ClientCardProps) {
  return (
    <div className="rounded-[14px] p-4 shadow-sm border border-border/40 bg-card">
      <h3 className="font-semibold mb-2">{client.name}</h3>
      <p className="text-sm text-muted-foreground">{client.id}</p>
      <button 
        className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
        onClick={() => onSelectClient(client)}
      >
        Select
      </button>
    </div>
  );
}
```

## Testing

### Angular Testing

```typescript
describe('ClientCardComponent', () => {
  let component: ClientCardComponent;
  let fixture: ComponentFixture<ClientCardComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ClientCardComponent);
    component = fixture.componentInstance;
    component.client = { id: '1', name: 'Test Client' };
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display client name', () => {
    const nameElement = fixture.nativeElement.querySelector('.client-name');
    expect(nameElement.textContent).toContain('Test Client');
  });
  
  it('should emit client when select button is clicked', () => {
    spyOn(component.selectClient, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.selectClient.emit).toHaveBeenCalledWith(component.client);
  });
});
```

### Next.js Testing with Jest and React Testing Library

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientCard } from './ClientCard';

describe('ClientCard', () => {
  const mockClient = { id: '1', name: 'Test Client' };
  const mockOnSelectClient = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders client information correctly', () => {
    render(<ClientCard client={mockClient} onSelectClient={mockOnSelectClient} />);
    
    expect(screen.getByText('Test Client')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
  
  it('calls onSelectClient when the select button is clicked', () => {
    render(<ClientCard client={mockClient} onSelectClient={mockOnSelectClient} />);
    
    const selectButton = screen.getByRole('button', { name: /select/i });
    fireEvent.click(selectButton);
    
    expect(mockOnSelectClient).toHaveBeenCalledWith(mockClient);
  });
});
```

## Performance Considerations

### Lazy Loading

**Angular:**
```typescript
const routes: Routes = [
  {
    path: 'clients',
    loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)
  }
];
```

**Next.js:**
```tsx
import dynamic from 'next/dynamic';

const ClientAnalytics = dynamic(() => import('./components/ClientAnalytics'), {
  loading: () => <div>Loading...</div>
});
```

### Memoization

**Angular:**
```typescript
@Component({
  selector: 'app-expensive-component',
  template: `<div>{{ expensiveCalculation }}</div>`
})
export class ExpensiveComponent {
  private _value = 0;
  private _expensiveCalculation: number | null = null;
  
  @Input()
  set value(val: number) {
    if (this._value !== val) {
      this._value = val;
      this._expensiveCalculation = null;
    }
  }
  
  get expensiveCalculation(): number {
    if (this._expensiveCalculation === null) {
      // Expensive calculation
      this._expensiveCalculation = /* ... */;
    }
    return this._expensiveCalculation;
  }
}
```

**Next.js:**
```tsx
import { useMemo } from 'react';

function ExpensiveComponent({ value }: { value: number }) {
  const expensiveCalculation = useMemo(() => {
    // Expensive calculation
    return /* ... */;
  }, [value]);
  
  return <div>{expensiveCalculation}</div>;
}
```

## Conclusion

Migrating from Angular to Next.js requires understanding the fundamental differences between the frameworks and adapting your code accordingly. By following the patterns and examples in this guide, you can successfully migrate your Angular components, services, and features to our Next.js application while maintaining consistency with our established architecture.

Remember to:

1. Break down Angular components into smaller, focused React components (keep under 200 lines)
2. Convert Angular services to custom hooks
3. Replace RxJS observables with React Query for data fetching
4. Adapt Angular forms to React Hook Form with Zod validation
5. Follow our established iOS-inspired design system and Tailwind CSS styling conventions
6. Implement proper testing for your migrated components

For any questions or assistance with the migration process, please reach out to the development team.
