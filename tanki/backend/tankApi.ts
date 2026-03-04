import { supabase } from './supabase';

export type Tank = {
  id: string;
  tankname: string | null;
  capacity: number;
};

export type TankReading = {
  id: string;
  tank_id: string;
  temperature: number;
  ph: number;
  water_level_percent: number;
  water_level_liters: number;
  created_at: string;
  tds: number | null;
};

export type TankWithReading = Tank & {
  latestReading: TankReading | null;
  predictedLevel: number | null;
};

export function formatLastSync(createdAt: string | null | undefined): string {
  if (!createdAt) return 'No data';
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function fetchAllTanks(): Promise<Tank[]> {
  console.log('[tankApi] fetchAllTanks: calling supabase...');
  const { data, error } = await supabase
    .from('tank')
    .select('id, tankname, capacity');

  if (error) {
    console.log('[tankApi] fetchAllTanks ERROR:', JSON.stringify(error));
    return [];
  }

  console.log('[tankApi] fetchAllTanks result:', JSON.stringify(data));
  return data ?? [];
}

export async function fetchLatestReading(tankId: string): Promise<TankReading | null> {
  console.log(`[tankApi] fetchLatestReading: tankId=${tankId}`);
  const { data, error } = await supabase
    .from('tank_readings')
    .select('*')
    .eq('tank_id', tankId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log(`[tankApi] fetchLatestReading ERROR for ${tankId}:`, JSON.stringify(error));
    return null;
  }

  console.log(`[tankApi] fetchLatestReading result for ${tankId}:`, JSON.stringify(data));
  return data;
}

export async function fetchLatestPrediction(tankId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('predictions')
    .select('predicted_level')
    .eq('tank_id', tankId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log(`[tankApi] fetchLatestPrediction ERROR for ${tankId}:`, JSON.stringify(error));
    return null;
  }
  return data ? Number(data.predicted_level) : null;
}

export async function fetchTanksWithLatestReadings(): Promise<TankWithReading[]> {
  console.log('[tankApi] fetchTanksWithLatestReadings: starting...');
  const tanks = await fetchAllTanks();
  console.log(`[tankApi] fetchTanksWithLatestReadings: got ${tanks.length} tanks`);

  const tanksWithReadings = await Promise.all(
    tanks.map(async (tank) => {
      const [latestReading, predictedLevel] = await Promise.all([
        fetchLatestReading(tank.id),
        fetchLatestPrediction(tank.id),
      ]);
      return { ...tank, latestReading, predictedLevel };
    })
  );

  console.log('[tankApi] fetchTanksWithLatestReadings: done', JSON.stringify(tanksWithReadings));
  return tanksWithReadings;
}

export type AggregatedStats = {
  totalLiters: number;
  totalCapacity: number;
  percentageFull: number;
  predictedPercentageFull: number | null;
  lastSync: string;
};

export async function fetchAggregatedStats(): Promise<AggregatedStats> {
  const tanks = await fetchTanksWithLatestReadings();

  const totalCapacity = tanks.reduce((sum, t) => sum + t.capacity, 0);
  const totalLiters = tanks.reduce((sum, t) => sum + (t.latestReading?.water_level_liters ?? 0), 0);
  const percentageFull = totalCapacity > 0 ? Math.round((totalLiters / totalCapacity) * 100) : 0;

  const latestDate = tanks
    .map((t) => t.latestReading?.created_at)
    .filter(Boolean)
    .sort()
    .at(-1);

  const tanksWithPredictions = tanks.filter((t) => t.predictedLevel !== null);
  const predictedPercentageFull = tanksWithPredictions.length > 0
    ? Math.round(tanksWithPredictions.reduce((sum, t) => sum + t.predictedLevel!, 0) / tanksWithPredictions.length)
    : null;

  console.log('[tankApi] fetchAggregatedStats:', { totalLiters, totalCapacity, percentageFull, predictedPercentageFull });
  return { totalLiters, totalCapacity, percentageFull, predictedPercentageFull, lastSync: formatLastSync(latestDate) };
}

export async function fetchFirstTankWithReading(): Promise<TankWithReading | null> {
  const { data, error } = await supabase
    .from('tank')
    .select('id, tankname, capacity')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log('Error fetching first tank:', error);
    return null;
  }

  if (!data) return null;

  const [latestReading, predictedLevel] = await Promise.all([
    fetchLatestReading(data.id),
    fetchLatestPrediction(data.id),
  ]);
  return { ...data, latestReading, predictedLevel };
}
