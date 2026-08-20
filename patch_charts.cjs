const fs = require('fs');
let code = fs.readFileSync('src/components/OverviewTab.tsx', 'utf8');

// Add imports for Recharts
code = code.replace(
  `import { RadarChart } from './RadarChart';`,
  `import { RadarChart } from './RadarChart';\nimport { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';`
);

const newCharts = `      {/* 4. Timeline & Heatmap */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Activity Timeline (7 cols) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md lg:col-span-7">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">Timeline d'Activité Projets</h3>
            </div>
            <span className="text-xs text-zinc-400">Volume heuristique de commits</span>
          </div>
          <div className="h-48 w-full">
            {quantitativeMetrics.activityTimeline && quantitativeMetrics.activityTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quantitativeMetrics.activityTimeline}>
                  <XAxis dataKey="year" stroke="#52525b" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#52525b" fontSize={11} axisLine={false} tickLine={false} width={30} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="commits" 
                    name="Volume d'activité" 
                    stroke="#818cf8" 
                    strokeWidth={3} 
                    dot={{ fill: '#818cf8', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">Données insuffisantes pour la timeline.</div>
            )}
          </div>
        </div>

        {/* Heatmap des technologies (5 cols) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md lg:col-span-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">Heatmap Technologique</h3>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languageDistribution.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: '#27272a', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="percentage" name="Proportion (%)" fill="#ec4899" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};`;

code = code.replace(
  `    </div>
  );
};`,
  newCharts
);

fs.writeFileSync('src/components/OverviewTab.tsx', code);
