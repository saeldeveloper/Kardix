"use client";

import { X, Calendar as CalendarIcon, ArrowLeft, ShoppingBag, List, Calendar as CalendarDaysIcon, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Database } from "@/types/database";

type Sale = Database["public"]["Tables"]["sales"]["Row"];

interface MonthlyCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthName: string;
  representativeDate: Date;
  sales: Sale[];
}

export default function MonthlyCalendarModal({
  isOpen,
  onClose,
  monthName,
  representativeDate,
  sales,
}: MonthlyCalendarModalProps) {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthYear = useMemo(() => {
    return {
      month: representativeDate.getMonth(),
      year: representativeDate.getFullYear(),
    };
  }, [representativeDate]);

  // Group sales by day
  const monthlyData = useMemo(() => {
    const data: Record<number, { total: number; count: number; sales: Sale[] }> = {};
    
    sales.forEach(sale => {
      const d = new Date(sale.sold_at);
      if (d.getMonth() === monthYear.month && d.getFullYear() === monthYear.year) {
        const day = d.getDate();
        if (!data[day]) data[day] = { total: 0, count: 0, sales: [] };
        data[day].total += sale.total;
        data[day].count += 1;
        data[day].sales.push(sale);
      }
    });
    
    return data;
  }, [sales, monthYear]);

  const calendarDays = useMemo(() => {
    const startOfMonth = new Date(monthYear.year, monthYear.month, 1);
    const endOfMonth = new Date(monthYear.year, monthYear.month + 1, 0);
    const firstDayOfWeek = startOfMonth.getDay();
    const totalDays = endOfMonth.getDate();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        data: monthlyData[i] || null
      });
    }
    return days;
  }, [monthYear, monthlyData]);

  if (!isOpen) return null;

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const monthTotal = Object.values(monthlyData).reduce((acc, d) => acc + d.total, 0);
  const activeDaysSorted = Object.keys(monthlyData)
    .map(Number)
    .sort((a, b) => b - a); // Newest first for list view

  const handleDayClick = (day: number) => {
    if (monthlyData[day]) {
      setSelectedDay(day);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden slide-in-from-bottom-4 animate-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {selectedDay ? (
              <button 
                onClick={() => setSelectedDay(null)}
                className="p-2 hover:bg-background rounded-full transition-colors text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-text-primary capitalize leading-tight">
                {selectedDay ? `Ventas del ${selectedDay} de ${monthName.split(' ')[0]}` : monthName}
              </h2>
              <p className="text-xs text-text-secondary">
                {selectedDay ? `${monthlyData[selectedDay].count} transacciones realizadas` : "Resumen de actividad mensual"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-all text-text-secondary hover:text-text-primary hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* View Toggles (only if not in day detail) */}
        {!selectedDay && (
          <div className="px-6 py-3 bg-background/30 flex gap-2 border-b border-border">
            <button 
              onClick={() => setView("calendar")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all
                ${view === "calendar" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-surface text-text-secondary border border-border"}
              `}
            >
              <CalendarDaysIcon className="w-4 h-4" />
              Calendario
            </button>
            <button 
              onClick={() => setView("list")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all
                ${view === "list" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-surface text-text-secondary border border-border"}
              `}
            >
              <List className="w-4 h-4" />
              Días con Ventas
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface">
          {selectedDay ? (
            /* Day Details View */
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              {monthlyData[selectedDay].sales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary text-sm">{sale.product_name}</h4>
                      <p className="text-[11px] text-text-secondary">
                        {sale.quantity} x Q{sale.unit_price.toFixed(2)} • {new Date(sale.sold_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-text-primary">Q{sale.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : view === "calendar" ? (
            /* Calendar View */
            <div className="animate-in fade-in">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map(wd => (
                  <div key={wd} className="text-center text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                    {wd}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((d, index) => (
                  <button 
                    key={index}
                    disabled={!d?.data}
                    onClick={() => d && handleDayClick(d.day)}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all
                      ${d === null ? "opacity-0 pointer-events-none" : ""}
                      ${d?.data ? "bg-primary text-white font-bold shadow-md hover:scale-105 active:scale-95" : "border border-border text-text-secondary opacity-50"}
                    `}
                  >
                    {d && (
                      <>
                        <span className="relative z-10">{d.day}</span>
                        {d.data && (
                          <div className="absolute inset-0 flex items-end justify-center pb-1.5">
                            <div className="w-1 h-1 rounded-full bg-white/60"></div>
                          </div>
                        )}
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Days List View */
            <div className="space-y-3 animate-in fade-in">
              {activeDaysSorted.length > 0 ? (
                activeDaysSorted.map(day => (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-surface hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-background rounded-xl flex flex-col items-center justify-center border border-border group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                        <span className="text-[10px] uppercase font-bold text-text-secondary group-hover:text-primary transition-colors">Día</span>
                        <span className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{day}</span>
                      </div>
                      <div>
                        <span className="block font-bold text-text-primary text-sm">
                          {monthlyData[day].count} {monthlyData[day].count === 1 ? 'Venta' : 'Ventas'}
                        </span>
                        <span className="text-xs text-text-secondary">
                          Toca para ver detalle
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-text-primary">
                        Q{monthlyData[day].total.toFixed(2)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-20 text-center text-text-secondary italic">
                  No hay ventas registradas en este periodo.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!selectedDay && (
          <div className="p-6 border-t border-border bg-background/50 flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/50"></div>
              <span className="text-text-secondary font-medium">Días con actividad</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-text-secondary block">Total del Mes</span>
              <span className="text-xl font-black text-text-primary">Q{monthTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
        
        {selectedDay && (
          <div className="p-4 border-t border-border bg-background/50">
            <button 
              onClick={() => setSelectedDay(null)}
              className="w-full btn-outline py-3 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Resumen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
