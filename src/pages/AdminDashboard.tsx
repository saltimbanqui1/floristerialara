import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Search, ChevronDown, Loader2 } from "lucide-react";

type Order = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  shipping_province: string | null;
  shipping_first_name: string | null;
  shipping_last_name: string | null;
  shipping_phone: string | null;
  delivery_type: string;
  delivery_date: string | null;
  delivery_time_slot: string | null;
  card_message: string | null;
  status: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  created_at: string;
  notes: string | null;
  items: OrderItem[];
};

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_image: string | null;
};

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  pending: { label: "Pendiente", variant: "outline" },
  preparing: { label: "En preparación", variant: "secondary" },
  delivered: { label: "Entregado", variant: "default" },
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/admin-login"); return; }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      navigate("/admin-login");
      return;
    }

    await fetchOrders();
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Fetch items for all orders
    const orderIds = (ordersData || []).map((o) => o.id);
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds.length > 0 ? orderIds : ["none"]);

    const itemsByOrder = (itemsData || []).reduce((acc, item) => {
      if (!acc[item.order_id]) acc[item.order_id] = [];
      acc[item.order_id].push(item);
      return acc;
    }, {} as Record<string, OrderItem[]>);

    setOrders(
      (ordersData || []).map((o) => ({ ...o, items: itemsByOrder[o.id] || [] }))
    );
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setUpdatingId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter((o) =>
      `${o.first_name} ${o.last_name}`.toLowerCase().includes(q) ||
      (o.shipping_first_name && `${o.shipping_first_name} ${o.shipping_last_name}`.toLowerCase().includes(q)) ||
      o.shipping_postal_code?.includes(q) ||
      o.id.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return d;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-serif font-semibold text-foreground">Pedidos</h1>
          <p className="text-xs text-muted-foreground">{orders.length} pedidos en total</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar sesión">
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      {/* Search */}
      <div className="px-4 py-3 border-b">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código postal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Dirección</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead className="hidden md:table-cell">Dedicatoria</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead className="w-36">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No se encontraron pedidos
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow key={order.id}>
                  {/* ID */}
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {order.id.slice(0, 8)}
                  </TableCell>

                  {/* Cliente */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-medium text-sm">
                        {order.shipping_first_name || order.first_name}{" "}
                        {order.shipping_last_name || order.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.shipping_phone || order.phone}
                      </p>
                    </div>
                  </TableCell>

                  {/* Dirección */}
                  <TableCell className="hidden sm:table-cell">
                    {order.delivery_type === "pickup" ? (
                      <span className="text-xs text-muted-foreground italic">Recogida en tienda</span>
                    ) : (
                      <div className="space-y-0.5 text-sm">
                        <p>{order.shipping_address || "—"}</p>
                        <p>
                          {order.shipping_city}{" "}
                          {order.shipping_postal_code && (
                            <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0">
                              {order.shipping_postal_code}
                            </Badge>
                          )}
                        </p>
                      </div>
                    )}
                  </TableCell>

                  {/* Productos */}
                  <TableCell>
                    <div className="space-y-0.5">
                      {order.items.map((item) => (
                        <p key={item.id} className="text-sm flex justify-between gap-2">
                          <span>
                            {item.quantity > 1 && <span className="text-muted-foreground">{item.quantity}× </span>}
                            {item.product_name}
                          </span>
                          <span className="text-muted-foreground whitespace-nowrap">{item.total_price.toFixed(2)} €</span>
                        </p>
                      ))}
                      {order.items.length === 0 && (
                        <span className="text-xs text-muted-foreground">Sin productos</span>
                      )}
                      {order.items.length > 0 && (
                        <p className="text-xs font-medium text-foreground pt-1 border-t border-dashed text-right">
                          Total: {order.total.toFixed(2)} €
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Dedicatoria */}
                  <TableCell className="hidden md:table-cell max-w-[200px]">
                    {order.card_message ? (
                      <p className="text-sm italic whitespace-pre-wrap break-words leading-relaxed">
                        "{order.card_message}"
                      </p>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Entrega */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{formatDate(order.delivery_date)}</p>
                      {order.delivery_time_slot && (
                        <p className="text-xs text-muted-foreground">{order.delivery_time_slot}</p>
                      )}
                    </div>
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 px-2"
                          disabled={updatingId === order.id}
                        >
                          {updatingId === order.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Badge variant={STATUS_CONFIG[order.status]?.variant || "outline"}>
                                {STATUS_CONFIG[order.status]?.label || order.status}
                              </Badge>
                              <ChevronDown className="h-3 w-3" />
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => updateStatus(order.id, key)}
                            disabled={order.status === key}
                          >
                            {config.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card view for address & dedication */}
      <div className="sm:hidden px-4 pb-6 space-y-4">
        {filtered.map((order) => (
          <div key={`mobile-${order.id}`} className="rounded-lg border p-3 space-y-2 text-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {order.shipping_first_name || order.first_name}{" "}
                  {order.shipping_last_name || order.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{order.shipping_phone || order.phone}</p>
              </div>
              <Badge variant={STATUS_CONFIG[order.status]?.variant || "outline"} className="text-[10px]">
                {STATUS_CONFIG[order.status]?.label || order.status}
              </Badge>
            </div>

            {order.delivery_type !== "pickup" && order.shipping_address && (
              <div>
                <p>{order.shipping_address}</p>
                <p>
                  {order.shipping_city}{" "}
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {order.shipping_postal_code}
                  </Badge>
                </p>
              </div>
            )}

            {order.items.map((item) => (
              <p key={item.id} className="flex justify-between">
                <span>{item.quantity > 1 && `${item.quantity}× `}{item.product_name}</span>
                <span className="text-muted-foreground">{item.total_price.toFixed(2)} €</span>
              </p>
            ))}

            {order.card_message && (
              <p className="italic text-muted-foreground leading-relaxed whitespace-pre-wrap">
                "{order.card_message}"
              </p>
            )}

            <div className="flex justify-between items-center pt-1 border-t">
              <span className="text-xs text-muted-foreground">
                {formatDate(order.delivery_date)} {order.delivery_time_slot || ""}
              </span>
              <span className="font-medium">{order.total.toFixed(2)} €</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
