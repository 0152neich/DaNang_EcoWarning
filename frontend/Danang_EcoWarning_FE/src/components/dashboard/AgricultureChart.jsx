// src/components/dashboard/AgricultureChart.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  getAgricultureFilters,
  getAgricultureSearch,
} from "../../services/api";

// (Hàm parseMetricName giữ nguyên...)
const parseMetricName = (metricName, cropsList, aspectsList) => {
  if (aspectsList.includes(metricName)) {
    const foundCrop = cropsList.find((c) => metricName.includes(c));
    return { crop: foundCrop || null, aspect: metricName };
  }
  const parts = metricName.split(" - ");
  if (parts.length === 2) {
    const part1 = parts[0].trim();
    const part2 = parts[1].trim();
    if (cropsList.includes(part1) && aspectsList.includes(part2)) {
      return { crop: part1, aspect: part2 };
    }
    if (aspectsList.includes(part1) && cropsList.includes(part2)) {
      return { crop: part2, aspect: part1 };
    }
  }
  console.warn(`Không thể phân tích: ${metricName}`);
  return { crop: null, aspect: null };
};

const AgricultureChart = () => {
  // (State giữ nguyên...)
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedAspect, setSelectedAspect] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [dataMap, setDataMap] = useState(new Map());
  const [rawData, setRawData] = useState([]);
  const [cropOptions, setCropOptions] = useState([]);
  const [aspectOptions, setAspectOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [chartData, setChartData] = useState([]);

  // --- 1. useEffect: Tải và Phân tích Dữ liệu ---
  useEffect(() => {
    const initialize = async () => {
      try {
        const [filterResponse, dataResponse] = await Promise.all([
          getAgricultureFilters(),
          getAgricultureSearch(),
        ]);

        const masterLists = filterResponse;
        const allData = dataResponse;
        setRawData(allData);

        // (Logic xây dựng dataMap giữ nguyên...)
        const newMap = new Map();
        allData.forEach((item) => {
          const { metricName, unit } = item;
          if (!metricName || !unit) return;
          const { crop, aspect } = parseMetricName(
            metricName,
            masterLists.crops,
            masterLists.aspects
          );
          if (!crop || !aspect) return;
          if (!newMap.has(crop)) newMap.set(crop, new Map());
          const aspectMap = newMap.get(crop);
          if (!aspectMap.has(aspect)) aspectMap.set(aspect, new Set());
          const unitSet = aspectMap.get(aspect);
          unitSet.add(unit);
        });

        setDataMap(newMap);
        const allCrops = Array.from(newMap.keys()).sort();
        setCropOptions(allCrops);

        // --- THAY ĐỔI 1: TỰ ĐỘNG CHỌN CÂY TRỒNG ĐẦU TIÊN ---
        if (allCrops.length > 0) {
          setSelectedCrop(allCrops[0]); // Kích hoạt cascade
        }
        // --------------------------------------------------
      } catch (error) {
        console.error("Lỗi khi khởi tạo dữ liệu nông nghiệp:", error);
      }
    };

    initialize();
  }, []); // Mảng rỗng = chạy 1 lần

  // --- 2. Xử lý khi CÂY TRỒNG (Crop) thay đổi ---
  useEffect(() => {
    if (!selectedCrop || !dataMap.has(selectedCrop)) {
      setAspectOptions([]);
      setUnitOptions([]);
      setSelectedAspect("");
      setSelectedUnit("");
      return;
    }
    const aspectMap = dataMap.get(selectedCrop);
    const validAspects = Array.from(aspectMap.keys()).sort();
    setAspectOptions(validAspects);

    // --- THAY ĐỔI 2: TỰ ĐỘNG CHỌN TIÊU CHÍ ĐẦU TIÊN ---
    // (Thay vì setSelectedAspect("") )
    if (validAspects.length > 0) {
      setSelectedAspect(validAspects[0]); // Kích hoạt cascade tiếp theo
    } else {
      setSelectedAspect("");
    }
    // ------------------------------------------------
    setSelectedUnit(""); // (Vẫn reset unit)
  }, [selectedCrop, dataMap]);

  // --- 3. Xử lý khi TIÊU CHÍ (Aspect) thay đổi ---
  // (Giữ nguyên - nó đã tự động chọn unit đầu tiên)
  useEffect(() => {
    if (
      !selectedCrop ||
      !selectedAspect ||
      !dataMap.has(selectedCrop) ||
      !dataMap.get(selectedCrop).has(selectedAspect)
    ) {
      setUnitOptions([]);
      setSelectedUnit("");
      return;
    }
    const unitSet = dataMap.get(selectedCrop).get(selectedAspect);
    const validUnits = Array.from(unitSet).sort();
    setUnitOptions(validUnits);
    if (validUnits.length > 0) setSelectedUnit(validUnits[0]);
    else setSelectedUnit("");
  }, [selectedCrop, selectedAspect, dataMap]);

  // --- 4. Xử lý khi BỘ BA (Triplet) hoàn chỉnh -> Lọc và Vẽ Biểu đồ ---
  // (Giữ nguyên)
  useEffect(() => {
    if (!selectedCrop || !selectedAspect || !selectedUnit) {
      setChartData([]);
      return;
    }
    const filteredData = rawData.filter((item) => {
      const isUnitMatch = item.unit === selectedUnit;
      const isCropMatch = item.metricName.includes(selectedCrop);
      const isAspectMatch = item.metricName.includes(selectedAspect);
      return isUnitMatch && isCropMatch && isAspectMatch;
    });
    setChartData(
      filteredData.map((d) => ({
        ...d,
        year: d.year,
        totalValue: d.totalValue,
      }))
    );
  }, [selectedCrop, selectedAspect, selectedUnit, rawData]);

  // --- RENDER ---
  // (Phần render JSX giữ nguyên)
  return (
    <>
      <div className="chart-filters-container">
        {/* 1. BỘ LỌC CÂY TRỒNG */}
        <div className="filter-group">
          <label htmlFor="crop-select">Cây trồng:</label>
          <select
            id="crop-select"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            <option value="">-- Chọn cây trồng --</option>
            {cropOptions.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        {/* 2. BỘ LỌC TIÊU CHÍ */}
        <div className="filter-group">
          <label htmlFor="aspect-select">Tiêu chí:</label>
          <select
            id="aspect-select"
            value={selectedAspect}
            onChange={(e) => setSelectedAspect(e.target.value)}
            disabled={!selectedCrop}
          >
            <option value="">-- Chọn tiêu chí --</option>
            {aspectOptions.map((aspect) => (
              <option key={aspect} value={aspect}>
                {aspect}
              </option>
            ))}
          </select>
        </div>

        {/* 3. BỘ LỌC ĐƠN VỊ */}
        <div className="filter-group">
          <label htmlFor="unit-select">Đơn vị:</label>
          <select
            id="unit-select"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            disabled={!selectedAspect}
          >
            <option value="">-- Chọn đơn vị --</option>
            {unitOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- BIỂU ĐỒ --- */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalValue"
            name={chartData[0]?.metricName || "Đang tải..."}
            stroke="#3b82f6"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default AgricultureChart;
