import { useState, useEffect, useMemo, useRef } from 'react';
import * as hafs from 'quran-meta/hafs';
import * as qalun from 'quran-meta/qalun';
import * as warsh from 'quran-meta/warsh';
import { surahTranslations } from './quranDataTrans';
import {
  Sun,
  Moon,
  Search,
  Book,
  Compass,
  Code as CodeIcon,
  Layers,
  Copy,
  Check,
  Sparkles,
  Hash,
  Bookmark,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Compass as CompassIcon,
  Workflow,
  ChevronDown
} from 'lucide-react';
import type { Surah, Page, Juz, AyahNo, Manzil, Ruku } from 'quran-meta/hafs';

// Bilingual UI translations
const translations = {
  en: {
    title: "Quran Meta Sandbox",
    subtitle: "Complete developer environment & interactive visual workspace for the quran-meta database engine.",
    riwaya: "Recitation (Riwaya)",
    language: "Language",
    theme: "Theme",
    stats: {
      ayahs: "Total Verses",
      surahs: "Total Surahs",
      pages: "Total Pages",
      juzs: "Total Juzs",
      rukus: "Total Rukus",
      manzils: "Total Manzils",
      rubAlhizb: "Rub' Al-Hizb",
      sajdas: "Prostrations"
    },
    modes: {
      surah: "Surah & Ayah",
      page: "Page Explorer",
      juz: "Juz Boundaries",
      manzil: "Manzil Scope",
      ruku: "Ruku System",
      ayahId: "Verse ID Lookup"
    },
    labels: {
      searchSurah: "Search Surah...",
      selectSurah: "Select Surah",
      selectAyah: "Select Ayah",
      selectPage: "Select Page",
      selectJuz: "Select Juz",
      selectManzil: "Select Manzil",
      selectRuku: "Select Ruku",
      selectAyahId: "Select Verse ID",
      prev: "Prev",
      next: "Next",
      copyCode: "Copy Code",
      copied: "Copied!",
      codePlayground: "Live Code Playground",
      codePlaygroundDesc: "See the live ES module code matching your active selections",
      comparisonTitle: "Cross-Recitation Alignment Matrix",
      comparisonDesc: "Compare how the same chapter & verse coordinates map across other recitations",
      pageMapTitle: "Visual Quran Page Map",
      pageMapDesc: "Interactive index of all pages. Hover for details, click to jump to the page.",
      surahGridTitle: "Complete Surah Database Index",
      surahGridDesc: "Filter and search all 114 Surahs by name, number, classification, or revelation order",
      detailsTitle: "Active Metadata Inspector",
      detailsDesc: "Comprehensive spatial coordinate data from the quran-meta engine",
      flagActive: "Active Boundary",
      flagInactive: "Normal Flow",
      isStartOfSurah: "Start of Surah",
      isEndOfSurah: "End of Surah",
      isStartOfPage: "Start of Page",
      isEndOfPage: "End of Page",
      isStartOfJuz: "Start of Juz",
      isEndOfJuz: "End of Juz",
      isStartOfQuarter: "Start of Hizb Quarter",
      isEndOfQuarter: "End of Hizb Quarter",
      isStartOfRuku: "Start of Ruku",
      isEndOfRuku: "End of Ruku",
      isSajdahAyah: "Sajdah (Prostration)",
      revelationOrder: "Revelation Order",
      revelationPlace: "Place of Revelation",
      meccan: "Meccan",
      medinan: "Medinan",
      coordinates: "Resolved Spatial Coordinates",
      linearPosition: "Linear Verse Position in Surah",
      developerNotes: "Developer API Integration Guide",
      juzBoundaryDesc: "Juz boundaries and page spans",
      manzilBoundaryDesc: "Manzil boundaries and ayah span",
      rukuBoundaryDesc: "Ruku boundaries and page mapping",
      juzPagesSpan: "Pages included in this Juz",
      firstAyah: "First Ayah",
      lastAyah: "Last Ayah",
      firstAyahId: "First Ayah ID",
      lastAyahId: "Last Ayah ID",
      ayahsOnPage: "Verses on this Page",
      referenceParser: "Reference String Parser",
      referenceParserDesc: "Parse custom text references (e.g. 2:255, 18:110, 2:255-260) using string2NumberSplitter",
      applyCoordinates: "Apply Coordinates",
      invalidReference: "Invalid reference",
      juzShiftDesc: "Juz Shift Calculations (findJuzAndShift)",
      ayahsFromJuzStart: "Ayahs from Juz start",
      rangesAroundAyah: "Ayah Range Scopes (findRangeAroundAyah)",
      scopeJuz: "Juz Scope",
      scopeSurah: "Surah Scope",
      scopePage: "Page Scope",
      scopeRuku: "Ruku Scope",
      surroundingAyahs: "Surrounding Verses (nextAyah / prevAyah)",
      prevAyah: "Previous Ayah",
      nextAyah: "Next Ayah",
      interactiveSliders: "Coordinate Sliders"
    }
  },
  ar: {
    title: "مُسْتَكْشَفُ بَيَانَاتِ القُرْآنِ",
    subtitle: "مختبر بَياناتِي تفاعلي ومستكشف برمجي شامل لمقاييس وإحداثيات سور وآيات القرآن الكريم.",
    riwaya: "الرواية المقروء بها",
    language: "اللغة",
    theme: "المظهر",
    stats: {
      ayahs: "إجمالي الآيات",
      surahs: "إجمالي السور",
      pages: "إجمالي الصفحات",
      juzs: "إجمالي الأجزاء",
      rukus: "إجمالي الركوعات",
      manzils: "إجمالي المنازل",
      rubAlhizb: "أرباع الأحزاب",
      sajdas: "آيات السجدة"
    },
    modes: {
      surah: "السورة والآية",
      page: "مستكشف الصفحات",
      juz: "حدود الأجزاء",
      manzil: "منزل القراءة",
      ruku: "نظام الركوع",
      ayahId: "الرقم التسلسلي"
    },
    labels: {
      searchSurah: "ابحث عن سورة...",
      selectSurah: "اختر السورة",
      selectAyah: "اختر الآية",
      selectPage: "اختر الصفحة",
      selectJuz: "اختر الجزء",
      selectManzil: "اختر المنزل",
      selectRuku: "اختر الركوع",
      selectAyahId: "اختر الرقم التسلسلي للآية",
      prev: "السابق",
      next: "التالي",
      copyCode: "نسخ الكود",
      copied: "تم النسخ!",
      codePlayground: "مختبر الكود المباشر",
      codePlaygroundDesc: "شاهد كود ES Modules الفعلي المطابق لاختياراتك الحالية في الواجهة",
      comparisonTitle: "جدول مطابقة ومقارنة الروايات",
      comparisonDesc: "قارن كيف تختلف إحداثيات السور والصفحات للآية المحددة بين الروايات الشهيرة",
      pageMapTitle: "الخارطة المرئية لصفحات المصحف",
      pageMapDesc: "شبكة تفاعلية لصفحات المصحف كاملة. مرر لرؤية التفاصيل، واضغط للانتقال الفوري للصفحة.",
      surahGridTitle: "الفهرس الشامل لقاعدة بيانات السور",
      surahGridDesc: "ابحث وصفّ سور القرآن الـ 114 بالاسم أو الرقم أو نوع السورة أو ترتيب النزول",
      detailsTitle: "مفتش البيانات الوصفية النشط",
      detailsDesc: "تحليل الإحداثيات المكانية التفصيلية المستخرجة مباشرة من مكتبة quran-meta",
      flagActive: "بداية/نهاية حدّ",
      flagInactive: "تتابع طبيعي",
      isStartOfSurah: "بداية السورة",
      isEndOfSurah: "نهاية السورة",
      isStartOfPage: "بداية الصفحة",
      isEndOfPage: "نهاية الصفحة",
      isStartOfJuz: "بداية الجزء",
      isEndOfJuz: "نهاية الجزء",
      isStartOfQuarter: "بداية الربع (حزب)",
      isEndOfQuarter: "نهاية الربع (حزب)",
      isStartOfRuku: "بداية الركوع",
      isEndOfRuku: "نهاية الركوع",
      isSajdahAyah: "آية سجدة",
      revelationOrder: "ترتيب النزول",
      revelationPlace: "مكان النزول",
      meccan: "مكية",
      medinan: "مدنية",
      coordinates: "المواقع والإحداثيات المحسوبة",
      linearPosition: "الموقع الخطي للآية في السورة",
      developerNotes: "دليل المطور لدمج الـ API",
      juzBoundaryDesc: "نطاقات الجزء وحدود الصفحات التابعة له",
      manzilBoundaryDesc: "نطاقات المنزل وحدود الآيات التابعة له",
      rukuBoundaryDesc: "نطاقات الركوع وحدود الصفحات والآيات التابعة له",
      juzPagesSpan: "النطاق الفعلي لصفحات هذا الجزء",
      firstAyah: "الآية الأولى",
      lastAyah: "الآية الأخيرة",
      firstAyahId: "التسلسل للأولى",
      lastAyahId: "التسلسل للأخيرة",
      ayahsOnPage: "الآيات في هذه الصفحة",
      referenceParser: "محلل الصيغ والنصوص المرجعية",
      referenceParserDesc: "اكتب صيغة مرجعية تفاعلية (مثل 2:255 أو 18:110) لتحليلها ديناميكيًا باستخدام الدالة string2NumberSplitter",
      applyCoordinates: "تطبيق الإحداثيات",
      invalidReference: "صيغة غير صالحة",
      juzShiftDesc: "حساب إزاحة الجزء (findJuzAndShift)",
      ayahsFromJuzStart: "الآيات المقروءة من بداية الجزء",
      rangesAroundAyah: "نطاقات الآية المحسوبة (findRangeAroundAyah)",
      scopeJuz: "نطاق الجزء",
      scopeSurah: "نطاق السورة",
      scopePage: "نطاق الصفحة",
      scopeRuku: "نطاق الركوع",
      surroundingAyahs: "الآيات المحيطة الفورية (nextAyah / prevAyah)",
      prevAyah: "الآية السابقة",
      nextAyah: "الآية التالية",
      interactiveSliders: "مؤشرات الإحداثيات"
    }
  }
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [riwaya, setRiwaya] = useState<'hafs' | 'qalun' | 'warsh'>('hafs');
  const [lookupMode, setLookupMode] = useState<'surah' | 'page' | 'juz' | 'manzil' | 'ruku' | 'ayahId'>('surah');

  // Input coordinate states
  const [surahNum, setSurahNum] = useState<number>(1);
  const [ayahNum, setAyahNum] = useState<number>(1);
  const [pageNum, setPageNum] = useState<number>(1);
  const [juzNum, setJuzNum] = useState<number>(1);
  const [manzilNum, setManzilNum] = useState<number>(1);
  const [rukuNum, setRukuNum] = useState<number>(1);
  const [ayahIdVal, setAyahIdVal] = useState<number>(1);

  // String reference parser states
  const [parseInput, setParseInput] = useState<string>('2:255');

  // UI state
  const [surahSearch, setSurahSearch] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Resolve current active Recitation Engine
  const rEngine = useMemo(() => {
    if (riwaya === 'qalun') return qalun;
    if (riwaya === 'warsh') return warsh;
    return hafs;
  }, [riwaya]);

  // Set active translations
  const t = useMemo(() => translations[lang], [lang]);

  // Sync color theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Parse reference input in real-time
  const parsedResult = useMemo(() => {
    if (!parseInput.trim()) return null;
    try {
      const res = rEngine.string2NumberSplitter(parseInput);
      if (res && res.surahOrAyah) {
        const s = res.surahOrAyah;
        const a = res.ayah || 1;
        const aTo = res.ayahTo || 0;
        const isValid = rEngine.isValidSurah(s) && rEngine.isValidAyahNo(a);
        return {
          surah: s,
          ayah: a,
          ayahTo: aTo,
          isValid,
          surahName: rEngine.SurahList[s]?.[4] || ''
        };
      }
    } catch (e) {}
    return null;
  }, [parseInput, rEngine]);

  const applyParsedCoordinates = () => {
    if (parsedResult && parsedResult.isValid) {
      handleSurahAyahChange(parsedResult.surah, parsedResult.ayah);
    }
  };

  // Sync inputs dynamically when lookup changes
  const handleSurahAyahChange = (s: number, a: number) => {
    if (!rEngine.isValidSurahAyah([s as Surah, a as AyahNo])) return;
    setSurahNum(s);
    setAyahNum(a);

    try {
      const absoluteId = rEngine.findAyahIdBySurah(s as Surah, a as AyahNo);
      setAyahIdVal(absoluteId);
      
      const aMeta = rEngine.getAyahMeta(absoluteId);
      if (aMeta) {
        setPageNum(aMeta.page);
        setJuzNum(aMeta.juz);
        
        // Dynamic lookups for new properties
        const mVal = rEngine.findManzilByAyahId(absoluteId);
        setManzilNum(mVal);

        const rkVal = rEngine.findRukuByAyahId(absoluteId);
        setRukuNum(rkVal);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePageChange = (p: number) => {
    if (p < 1 || p > rEngine.meta.numPages) return;
    setPageNum(p);
    try {
      const pMeta = rEngine.getPageMeta(p as Page);
      if (pMeta && pMeta.first) {
        const s = pMeta.first[0];
        const a = pMeta.first[1];
        setSurahNum(s);
        setAyahNum(a);
        setAyahIdVal(pMeta.firstAyahId);
        
        const firstId = rEngine.findAyahIdBySurah(s as Surah, a as AyahNo);
        const aMeta = rEngine.getAyahMeta(firstId);
        if (aMeta) {
          setJuzNum(aMeta.juz);
          setManzilNum(rEngine.findManzilByAyahId(firstId));
          setRukuNum(aMeta.ruku || rEngine.findRukuByAyahId(firstId));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleJuzChange = (j: number) => {
    if (j < 1 || j > 30) return;
    setJuzNum(j);
    try {
      const jMeta = rEngine.getJuzMeta(j as Juz);
      if (jMeta && jMeta.first) {
        const s = jMeta.first[0];
        const a = jMeta.first[1];
        setSurahNum(s);
        setAyahNum(a);
        setAyahIdVal(jMeta.firstAyahId);
        const startP = rEngine.findPage(s as Surah, a as AyahNo);
        setPageNum(startP);
        
        const firstId = rEngine.findAyahIdBySurah(s as Surah, a as AyahNo);
        setManzilNum(rEngine.findManzilByAyahId(firstId));
        setRukuNum(rEngine.findRukuByAyahId(firstId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleManzilChange = (m: number) => {
    if (m < 1 || m > 7) return;
    setManzilNum(m);
    try {
      const mMeta = rEngine.getManzilMeta(m as Manzil);
      if (mMeta && mMeta.first) {
        const s = mMeta.first[0];
        const a = mMeta.first[1];
        setSurahNum(s);
        setAyahNum(a);
        setAyahIdVal(mMeta.firstAyahId);
        
        const startP = rEngine.findPage(s as Surah, a as AyahNo);
        setPageNum(startP);
        setJuzNum(rEngine.findJuz(s, a));
        setRukuNum(rEngine.findRukuByAyahId(mMeta.firstAyahId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRukuChange = (rk: number) => {
    if (rk < 1 || rk > rEngine.meta.numRukus) return;
    setRukuNum(rk);
    try {
      const rkMeta = rEngine.getRukuMeta(rk as Ruku);
      if (rkMeta && rkMeta.first) {
        const s = rkMeta.first[0];
        const a = rkMeta.first[1];
        setSurahNum(s);
        setAyahNum(a);
        setAyahIdVal(rkMeta.firstAyahId);
        
        const startP = rEngine.findPage(s as Surah, a as AyahNo);
        setPageNum(startP);
        setJuzNum(rEngine.findJuz(s, a));
        setManzilNum(rEngine.findManzilByAyahId(rkMeta.firstAyahId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAyahIdChange = (id: number) => {
    if (id < 1 || id > rEngine.meta.numAyahs) return;
    setAyahIdVal(id);
    try {
      const coord = rEngine.findSurahAyahByAyahId(id);
      if (coord) {
        const [s, a] = coord;
        setSurahNum(s);
        setAyahNum(a);
        
        const aMeta = rEngine.getAyahMeta(id);
        if (aMeta) {
          setPageNum(aMeta.page);
          setJuzNum(aMeta.juz);
          setManzilNum(rEngine.findManzilByAyahId(id));
          setRukuNum(rEngine.findRukuByAyahId(id));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Compute total ayahs for the active surah in the active riwaya
  const activeSurahMaxAyahs = useMemo(() => {
    try {
      return rEngine.getAyahCountInSurah(surahNum as Surah);
    } catch (e) {
      return 7;
    }
  }, [surahNum, rEngine]);

  // Juz shift metrics (findJuzAndShiftByAyahId)
  const juzShiftData = useMemo(() => {
    try {
      return rEngine.findJuzAndShiftByAyahId(ayahIdVal);
    } catch (e) {
      return null;
    }
  }, [ayahIdVal, rEngine]);

  // Cross-Recitation Global Analytics comparing Hafs, Qalun, and Warsh in a unified three-row table
  const crossStats = useMemo(() => {
    const checkMismatch = (key: string) => {
      const hVal = (hafs.meta as any)[key];
      const qVal = (qalun.meta as any)[key];
      const wVal = (warsh.meta as any)[key];
      return hVal !== qVal || qVal !== wVal || hVal !== wVal;
    };

    return {
      columns: [
        { key: 'numAyahs', label: t.stats.ayahs, icon: <Hash size={12} className="inline-block mx-1 align-middle" /> },
        { key: 'numSurahs', label: t.stats.surahs, icon: <Book size={12} className="inline-block mx-1 align-middle" /> },
        { key: 'numPages', label: t.stats.pages, icon: <Layers size={12} className="inline-block mx-1 align-middle" /> },
        { key: 'numJuzs', label: t.stats.juzs, icon: <CompassIcon size={12} className="inline-block mx-1 align-middle" /> },
        { key: 'numRukus', label: t.stats.rukus, icon: <Workflow size={12} className="inline-block mx-1 align-middle" /> },
        { key: 'numManzils', label: t.stats.manzils, icon: <Layers size={12} className="inline-block mx-1 align-middle" /> },
        { key: 'numRubAlHizbs', label: t.stats.rubAlhizb, icon: <Compass size={12} className="inline-block mx-1 align-middle" /> },
        { key: 'numSajdas', label: t.stats.sajdas, icon: <Bookmark size={12} className="inline-block mx-1 align-middle" /> }
      ],
      rows: [
        {
          id: 'hafs',
          name: lang === 'ar' ? 'حفص عن عاصم (Hafs)' : 'Hafs (حفص عن عاصم)',
          meta: hafs.meta
        },
        {
          id: 'qalun',
          name: lang === 'ar' ? 'قالون عن نافع (Qalun)' : 'Qalun (قالون عن نافع)',
          meta: qalun.meta
        },
        {
          id: 'warsh',
          name: lang === 'ar' ? 'ورش عن نافع (Warsh)' : 'Warsh (ورش عن نافع)',
          meta: warsh.meta
        }
      ],
      mismatchMap: {
        numAyahs: checkMismatch('numAyahs'),
        numSurahs: checkMismatch('numSurahs'),
        numPages: checkMismatch('numPages'),
        numJuzs: checkMismatch('numJuzs'),
        numRukus: checkMismatch('numRukus'),
        numManzils: checkMismatch('numManzils'),
        numRubAlHizbs: checkMismatch('numRubAlHizbs'),
        numSajdas: checkMismatch('numSajdas')
      }
    };
  }, [lang, t]);

  // Parallel Recitation Columns for Side-by-Side comparison
  const hafsCol = useMemo(() => {
    try {
      const exists = hafs.isValidSurahAyah([surahNum as Surah, ayahNum as AyahNo]);
      if (!exists) return null;
      const id = hafs.findAyahIdBySurah(surahNum as Surah, ayahNum as AyahNo);
      const meta = hafs.getAyahMeta(id);
      return {
        id,
        meta,
        page: hafs.findPage(surahNum as Surah, ayahNum as AyahNo),
        juz: hafs.findJuz(surahNum as Surah, ayahNum as AyahNo),
        hizb: hafs.findRubAlHizb(surahNum as Surah, ayahNum as AyahNo),
        ruku: hafs.findRukuByAyahId(id),
        manzil: hafs.findManzilByAyahId(id),
        thumun: null,
        surahRange: hafs.findRangeAroundAyah(id, 'surah'),
        pageRange: hafs.findRangeAroundAyah(id, 'page'),
        juzRange: hafs.findRangeAroundAyah(id, 'juz'),
        rukuRange: hafs.findRangeAroundAyah(id, 'ruku'),
        prev: id > 1 ? hafs.findSurahAyahByAyahId(id - 1) : null,
        next: id < hafs.meta.numAyahs ? hafs.findSurahAyahByAyahId(id + 1) : null
      };
    } catch(e) { return null; }
  }, [surahNum, ayahNum]);

  const qalunCol = useMemo(() => {
    try {
      const exists = qalun.isValidSurahAyah([surahNum as Surah, ayahNum as AyahNo]);
      if (!exists) return null;
      const id = qalun.findAyahIdBySurah(surahNum as Surah, ayahNum as AyahNo);
      const meta = qalun.getAyahMeta(id);
      return {
        id,
        meta,
        page: qalun.findPage(surahNum as Surah, ayahNum as AyahNo),
        juz: qalun.findJuz(surahNum as Surah, ayahNum as AyahNo),
        hizb: qalun.findRubAlHizb(surahNum as Surah, ayahNum as AyahNo),
        ruku: qalun.findRukuByAyahId(id),
        manzil: qalun.findManzilByAyahId(id),
        thumun: (qalun as any)['findThumunAlHizb'] ? (qalun as any)['findThumunAlHizb'](surahNum as Surah, ayahNum as AyahNo) : null,
        surahRange: qalun.findRangeAroundAyah(id, 'surah'),
        pageRange: qalun.findRangeAroundAyah(id, 'page'),
        juzRange: qalun.findRangeAroundAyah(id, 'juz'),
        rukuRange: qalun.findRangeAroundAyah(id, 'ruku'),
        prev: id > 1 ? qalun.findSurahAyahByAyahId(id - 1) : null,
        next: id < qalun.meta.numAyahs ? qalun.findSurahAyahByAyahId(id + 1) : null
      };
    } catch(e) { return null; }
  }, [surahNum, ayahNum]);

  const warshCol = useMemo(() => {
    try {
      const exists = warsh.isValidSurahAyah([surahNum as Surah, ayahNum as AyahNo]);
      if (!exists) return null;
      const id = warsh.findAyahIdBySurah(surahNum as Surah, ayahNum as AyahNo);
      const meta = warsh.getAyahMeta(id);
      return {
        id,
        meta,
        page: warsh.findPage(surahNum as Surah, ayahNum as AyahNo),
        juz: warsh.findJuz(surahNum as Surah, ayahNum as AyahNo),
        hizb: warsh.findRubAlHizb(surahNum as Surah, ayahNum as AyahNo),
        ruku: warsh.findRukuByAyahId(id),
        manzil: warsh.findManzilByAyahId(id),
        thumun: (warsh as any)['findThumunAlHizb'] ? (warsh as any)['findThumunAlHizb'](surahNum as Surah, ayahNum as AyahNo) : null,
        surahRange: warsh.findRangeAroundAyah(id, 'surah'),
        pageRange: warsh.findRangeAroundAyah(id, 'page'),
        juzRange: warsh.findRangeAroundAyah(id, 'juz'),
        rukuRange: warsh.findRangeAroundAyah(id, 'ruku'),
        prev: id > 1 ? warsh.findSurahAyahByAyahId(id - 1) : null,
        next: id < warsh.meta.numAyahs ? warsh.findSurahAyahByAyahId(id + 1) : null
      };
    } catch(e) { return null; }
  }, [surahNum, ayahNum]);

  // Unified diff checker comparing metadata properties across the 3 recitations
  const diffs = useMemo(() => {
    if (!hafsCol || !qalunCol || !warshCol) return null;
    return {
      id: hafsCol.id !== qalunCol.id || hafsCol.id !== warshCol.id,
      page: hafsCol.page !== qalunCol.page || hafsCol.page !== warshCol.page,
      juz: hafsCol.juz !== qalunCol.juz || hafsCol.juz !== warshCol.juz,
      hizb: hafsCol.hizb !== qalunCol.hizb || hafsCol.hizb !== warshCol.hizb,
      ruku: hafsCol.ruku !== qalunCol.ruku || hafsCol.ruku !== warshCol.ruku,
      manzil: hafsCol.manzil !== qalunCol.manzil || hafsCol.manzil !== warshCol.manzil,
      rub: hafsCol.meta?.rubAlHizbId !== qalunCol.meta?.rubAlHizbId || hafsCol.meta?.rubAlHizbId !== warshCol.meta?.rubAlHizbId,
      thumun: qalunCol.thumun !== warshCol.thumun,
      isSajdah: hafsCol.meta?.isSajdahAyah !== qalunCol.meta?.isSajdahAyah || hafsCol.meta?.isSajdahAyah !== warshCol.meta?.isSajdahAyah,
      isStartSurah: hafsCol.meta?.isStartOfSurah !== qalunCol.meta?.isStartOfSurah || hafsCol.meta?.isStartOfSurah !== warshCol.meta?.isStartOfSurah,
      isEndSurah: hafsCol.meta?.isEndOfSurah !== qalunCol.meta?.isEndOfSurah || hafsCol.meta?.isEndOfSurah !== warshCol.meta?.isEndOfSurah,
      isStartPage: hafsCol.meta?.isStartOfPage !== qalunCol.meta?.isStartOfPage || hafsCol.meta?.isStartOfPage !== warshCol.meta?.isStartOfPage,
      isEndPage: hafsCol.meta?.isEndOfPage !== qalunCol.meta?.isEndOfPage || hafsCol.meta?.isEndOfPage !== warshCol.meta?.isEndOfPage,
      isStartJuz: hafsCol.meta?.isStartOfJuz !== qalunCol.meta?.isStartOfJuz || hafsCol.meta?.isStartOfJuz !== warshCol.meta?.isStartOfJuz,
      
      surahRange: JSON.stringify(hafsCol.surahRange) !== JSON.stringify(qalunCol.surahRange) || JSON.stringify(hafsCol.surahRange) !== JSON.stringify(warshCol.surahRange),
      pageRange: JSON.stringify(hafsCol.pageRange) !== JSON.stringify(qalunCol.pageRange) || JSON.stringify(hafsCol.pageRange) !== JSON.stringify(warshCol.pageRange),
      juzRange: JSON.stringify(hafsCol.juzRange) !== JSON.stringify(qalunCol.juzRange) || JSON.stringify(hafsCol.juzRange) !== JSON.stringify(warshCol.juzRange),
      rukuRange: JSON.stringify(hafsCol.rukuRange) !== JSON.stringify(qalunCol.rukuRange) || JSON.stringify(hafsCol.rukuRange) !== JSON.stringify(warshCol.rukuRange)
    };
  }, [hafsCol, qalunCol, warshCol]);

  // Resolve current active Surah metadata
  const currentSurahMeta = useMemo(() => {
    try {
      return rEngine.getSurahMeta(surahNum as Surah);
    } catch (e) {}
    return null;
  }, [surahNum, rEngine]);

  // Resolve current active Page metadata
  const currentPageMeta = useMemo(() => {
    try {
      return rEngine.getPageMeta(pageNum as Page);
    } catch (e) {}
    return null;
  }, [pageNum, rEngine]);

  // Resolve current active Juz metadata
  const currentJuzMeta = useMemo(() => {
    try {
      return rEngine.getJuzMeta(juzNum as Juz);
    } catch (e) {}
    return null;
  }, [juzNum, rEngine]);

  // Resolve current active Manzil metadata
  const currentManzilMeta = useMemo(() => {
    try {
      return rEngine.getManzilMeta(manzilNum as Manzil);
    } catch (e) {}
    return null;
  }, [manzilNum, rEngine]);

  // Resolve current active Ruku metadata
  const currentRukuMeta = useMemo(() => {
    try {
      return rEngine.getRukuMeta(rukuNum as Ruku);
    } catch (e) {}
    return null;
  }, [rukuNum, rEngine]);

  // List of all verses on the current active page
  const versesOnPage = useMemo(() => {
    if (!currentPageMeta) return [];
    const list: Array<{ id: number; surah: number; ayah: number }> = [];
    for (let id = currentPageMeta.firstAyahId; id <= currentPageMeta.lastAyahId; id++) {
      try {
        const coord = rEngine.findSurahAyahByAyahId(id);
        if (coord) {
          list.push({ id, surah: coord[0], ayah: coord[1] });
        }
      } catch (e) {}
    }
    return list;
  }, [currentPageMeta, rEngine]);


  // Filtered Surah lists for active search dropdown
  const filteredSurahs = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 114; i++) {
      const item = rEngine.SurahList[i];
      if (!item) continue;
      const arabicName = item[4] as string;
      const transData = surahTranslations[i];
      const transName = transData ? transData.transliteration : '';
      const transMean = transData ? transData.translation : '';
      
      const query = surahSearch.toLowerCase();
      const match = 
        String(i).includes(query) ||
        arabicName.includes(query) ||
        transName.toLowerCase().includes(query) ||
        transMean.toLowerCase().includes(query);

      if (match) {
        list.push({
          number: i,
          arabicName,
          transliteration: transName,
          translation: transMean,
          ayahCount: item[1] as number,
          isMeccan: item[5] as boolean
        });
      }
    }
    return list;
  }, [surahSearch, rEngine]);



  // Dynamic code generation for live code playground
  const generatedCode = useMemo(() => {
    const activeImport = `import { getAyahMeta, getSurahMeta, getPageMeta, getJuzMeta, getManzilMeta, getRukuMeta, findRangeAroundAyah } from 'quran-meta/${riwaya}';`;
    
    if (lookupMode === 'surah') {
      return `${activeImport}

// Get metadata for Surah ${surahNum}, Ayah ${ayahNum}
const absoluteId = findAyahIdBySurah(${surahNum}, ${ayahNum});
const ayahMetadata = getAyahMeta(absoluteId);
console.log(ayahMetadata);

// Bounding range coordinates around active Ayah
const surahBoundaries = findRangeAroundAyah(absoluteId, 'surah'); // returns absolute AyahId [start, end]
console.log(\`Surah bounds: ID \${surahBoundaries[0]} to \${surahBoundaries[1]}\`);`;
    }
    
    if (lookupMode === 'page') {
      return `${activeImport}

// Get page coordinate boundaries for Page ${pageNum}
const pageMetadata = getPageMeta(${pageNum});
console.log(pageMetadata);`;
    }

    if (lookupMode === 'juz') {
      return `${activeImport}

// Get juz coordinate boundaries for Juz ${juzNum}
const juzMetadata = getJuzMeta(${juzNum});
console.log(juzMetadata);`;
    }

    if (lookupMode === 'manzil') {
      return `${activeImport}

// Get manzil coordinate boundaries for Manzil ${manzilNum}
const manzilMetadata = getManzilMeta(${manzilNum});
console.log(manzilMetadata);`;
    }

    if (lookupMode === 'ruku') {
      return `${activeImport}

// Get ruku coordinate boundaries for Ruku ${rukuNum}
const rukuMetadata = getRukuMeta(${rukuNum});
console.log(rukuMetadata);`;
    }

    return `import { findSurahAyahByAyahId, getAyahMeta, findJuzAndShiftByAyahId } from 'quran-meta/${riwaya}';

// Resolve coordinates of absolute Verse ID ${ayahIdVal}
const [surahNum, ayahNum] = findSurahAyahByAyahId(${ayahIdVal});
console.log(\`Coordinate: Surah \${surahNum}, Ayah \${ayahNum}\`);

// Fetch relative Juz shift from start of Juz
const shiftData = findJuzAndShiftByAyahId(${ayahIdVal});
console.log(shiftData); // { juz: ${juzNum}, leftAyahId: ${juzShiftData?.leftAyahId || 0}, ayahsBetweenJuzSurah: ${juzShiftData?.ayahsBetweenJuzSurah || 0} }`;
  }, [lookupMode, riwaya, surahNum, ayahNum, pageNum, juzNum, manzilNum, rukuNum, ayahIdVal, juzShiftData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrevVerse = () => {
    if (ayahIdVal > 1) {
      handleAyahIdChange(ayahIdVal - 1);
    }
  };

  const handleNextVerse = () => {
    if (ayahIdVal < rEngine.meta.numAyahs) {
      handleAyahIdChange(ayahIdVal + 1);
    }
  };

  return (
    <div 
      className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 antialiased" 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* ==================================================== */}
        {/* HEADER BAR                                           */}
        {/* ==================================================== */}
        <header className="glass shadow-premium rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-lg shadow-sm border border-border relative overflow-hidden group cursor-pointer">
              <span className="relative z-10 font-serif">ق</span>
              <div className="absolute inset-0 bg-white/10 dark:bg-black/10 translate-y-12 group-hover:translate-y-0 transition-transform duration-200" />
            </div>
            <div className="text-center md:text-start">
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent leading-none pb-1 tracking-tight">
                {t.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Config Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Riwaya Picker Tabs */}
            <div className="flex bg-secondary p-1 rounded-md border border-border">
              <button
                onClick={() => { setRiwaya('hafs'); handleSurahAyahChange(surahNum, 1); }}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                  riwaya === 'hafs'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang === 'ar' ? 'حفص' : 'Hafs'}
              </button>
              <button
                onClick={() => { setRiwaya('qalun'); handleSurahAyahChange(surahNum, 1); }}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                  riwaya === 'qalun'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang === 'ar' ? 'قالون' : 'Qalun'}
              </button>
              <button
                onClick={() => { setRiwaya('warsh'); handleSurahAyahChange(surahNum, 1); }}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                  riwaya === 'warsh'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang === 'ar' ? 'ورش' : 'Warsh'}
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center font-bold text-xs border border-border text-foreground hover:bg-secondary/80 transition-colors shadow-sm cursor-pointer"
              title={t.language}
            >
              {lang === 'en' ? 'AR' : 'EN'}
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center border border-border text-foreground hover:bg-secondary/80 transition-all shadow-sm cursor-pointer"
              title={t.theme}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} className="animate-pulse" />}
            </button>
          </div>
        </header>

        {/* ==================================================== */}
        {/* RECITATION COMPARISON STATS TABLE                     */}
        {/* ==================================================== */}
        <section className="glass shadow-premium rounded-lg border border-border overflow-hidden text-start animate-scale-in">
          <div className="bg-secondary/35 p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-foreground text-sm">
                {lang === 'ar' ? 'المقارنة الشاملة للبيانات الإحصائية بين الروايات' : 'Cross-Recitation Global Analytics'}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === 'ar' ? 'مقارنة إحصائية كاملة بين الروايات الثلاث مع إبراز الفروقات وتحديد الرواية النشطة حالياً' : 'Comprehensive comparison between the three Recitations with difference highlighting'}
              </p>
            </div>
            
            {/* Active Legend badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                </span>
                {lang === 'ar' ? 'فروقات في الأعداد' : 'Differences Found'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-xs border-collapse text-foreground min-w-[800px]">
              <thead>
                <tr className="bg-secondary/30 border-b border-border">
                  <th className="p-3 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest text-start">
                    {lang === 'ar' ? 'الرواية المقروء بها' : 'Recitation (Riwaya)'}
                  </th>
                  {crossStats.columns.map((col) => (
                    <th key={col.key} className="p-3 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {col.icon}
                        <span>{col.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {crossStats.rows.map((row) => {
                  const isActive = riwaya === row.id;
                  return (
                    <tr 
                      key={row.id}
                      onClick={() => setRiwaya(row.id as any)}
                      className={`transition-all duration-200 cursor-pointer ${
                        isActive 
                          ? 'bg-primary/[0.04] dark:bg-primary/[0.08] font-bold ' + (lang === 'ar' ? 'border-r-4 border-r-primary' : 'border-l-4 border-l-primary')
                          : 'hover:bg-secondary/20 bg-background'
                      }`}
                    >
                      {/* Riwayah name & Active status badge */}
                      <td className="p-3 font-semibold text-start whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{row.name}</span>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                              {lang === 'ar' ? 'النشطة' : 'Active'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stat columns comparison */}
                      {crossStats.columns.map((col) => {
                        const val = (row.meta as any)[col.key];
                        const isDiff = crossStats.mismatchMap[col.key as keyof typeof crossStats.mismatchMap];
                        return (
                          <td key={col.key} className="p-3 text-center font-mono whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2.5">
                              <span className={`text-sm ${isActive ? 'font-extrabold text-foreground' : 'text-foreground/80'}`}>
                                {val.toLocaleString()}
                              </span>
                              
                              {/* Glowing mismatch badge */}
                              {isDiff && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse relative">
                                  <span className="absolute top-0 right-0 flex h-1.5 w-1.5 -mt-0.5 -mr-0.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                                  </span>
                                  {lang === 'ar' ? 'مختلف' : 'Diff'}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ==================================================== */}
        {/* MAIN SANDBOX LAYOUT                                  */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDE: CONTROLS & SELECTION (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive Control Center */}
            <div className="glass shadow-premium rounded-lg border border-border overflow-hidden">
              <div className="bg-primary text-primary-foreground p-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider">{t.labels.interactiveSliders}</h3>
                </div>
              </div>

              {/* Tab Selector for All Six Search Modes */}
              <div className="grid grid-cols-3 border-b border-border p-2 gap-1 bg-secondary/35">
                {(['surah', 'page', 'juz', 'manzil', 'ruku', 'ayahId'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setLookupMode(m)}
                    className={`py-1.5 text-[10px] font-bold rounded-sm transition-all cursor-pointer ${
                      lookupMode === m
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t.modes[m]}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6">
                
                {/* 1. SURAH & AYAH CONTROLLER */}
                {lookupMode === 'surah' && (
                  <div className="space-y-5 animate-scale-in">
                    
                    {/* Surah Dropdown Autocomplete */}
                    <div className="space-y-2" ref={dropdownRef}>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        {t.labels.selectSurah}
                      </label>
                      <div className="relative">
                        {!isDropdownOpen ? (
                          <button
                            type="button"
                            onClick={() => { setIsDropdownOpen(true); setSurahSearch(''); }}
                            className="w-full p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-start flex items-center justify-between transition-all hover:bg-secondary/25 hover:border-primary/45 cursor-pointer shadow-premium"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded font-mono text-[9px] font-bold flex items-center justify-center bg-primary text-primary-foreground font-extrabold shadow-sm">
                                  {surahNum}
                                </span>
                                <h4 className="font-extrabold text-sm text-foreground">
                                  {surahTranslations[surahNum]?.transliteration || ''}
                                </h4>
                              </div>
                              <p className="text-[10px] text-muted-foreground leading-tight font-medium">
                                {surahTranslations[surahNum]?.translation || ''} &bull; {rEngine.SurahList[surahNum]?.[1]} {t.stats.ayahs.toLowerCase()}
                              </p>
                            </div>

                            <div className="flex items-center gap-4 text-end">
                              <div className="space-y-1.5">
                                <p className="font-serif text-foreground font-extrabold text-base leading-none">
                                  {rEngine.SurahList[surahNum]?.[4] || ''}
                                </p>
                                <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border bg-secondary border-border text-foreground">
                                  {rEngine.SurahList[surahNum]?.[5] ? t.labels.meccan : t.labels.medinan}
                                </span>
                              </div>
                              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center border border-border text-muted-foreground">
                                <ChevronDown size={14} />
                              </div>
                            </div>
                          </button>
                        ) : (
                          <div className="relative">
                            <input
                              type="text"
                              placeholder={t.labels.searchSurah}
                              value={surahSearch}
                              autoFocus
                              onChange={(e) => setSurahSearch(e.target.value)}
                              className="w-full bg-background border border-primary rounded-xl px-4 py-3.5 text-sm focus:outline-none text-foreground shadow-sm font-semibold pr-10 pl-10"
                            />
                            <Search size={15} className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-muted-foreground`} />
                          </div>
                        )}

                        {/* Autocomplete Dropdown Panel */}
                        {isDropdownOpen && (
                          <div className="absolute z-20 w-full mt-1.5 bg-background border border-border rounded-md max-h-80 overflow-y-auto shadow-xl p-2 space-y-1.5 scrollbar-thin">
                            {filteredSurahs.length > 0 ? (
                              filteredSurahs.map((s) => {
                                const isSelected = surahNum === s.number;
                                return (
                                  <button
                                    key={s.number}
                                    onClick={() => {
                                      handleSurahAyahChange(s.number, 1);
                                      setIsDropdownOpen(false);
                                      setSurahSearch('');
                                    }}
                                    className={`w-full p-3 rounded-lg border text-start flex items-center justify-between transition-all hover:bg-secondary/25 hover:shadow-sm cursor-pointer ${
                                      isSelected
                                        ? 'bg-secondary/60 border-foreground shadow-sm'
                                        : 'bg-background border-border/50'
                                    }`}
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className={`w-5 h-5 rounded font-mono text-[9px] font-bold flex items-center justify-center ${
                                          isSelected ? 'bg-primary text-primary-foreground font-extrabold shadow-sm' : 'bg-secondary text-muted-foreground'
                                        }`}>
                                          {s.number}
                                        </span>
                                        <h4 className="font-extrabold text-xs text-foreground">
                                          {s.transliteration}
                                        </h4>
                                      </div>
                                      <p className="text-[10px] text-muted-foreground leading-tight font-medium">
                                        {s.translation} &bull; {s.ayahCount} {t.stats.ayahs.toLowerCase()}
                                      </p>
                                    </div>

                                    <div className="text-end space-y-1">
                                      <p className="font-serif text-foreground font-extrabold text-xs">
                                        {s.arabicName}
                                      </p>
                                      <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border bg-secondary border-border text-foreground">
                                        {s.isMeccan ? t.labels.meccan : t.labels.medinan}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })
                            ) : (
                              <div className="text-center py-4 text-xs text-muted-foreground font-medium">
                                No Surah Matches Found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ayah Slider Control */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                          {t.labels.selectAyah}
                        </span>
                        <span className="bg-secondary text-foreground font-extrabold px-2.5 py-0.5 rounded text-xs font-mono border border-border">
                          {ayahNum} / {activeSurahMaxAyahs}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={activeSurahMaxAyahs}
                        value={ayahNum}
                        onChange={(e) => handleSurahAyahChange(surahNum, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                        <span>1</span>
                        <span>{activeSurahMaxAyahs}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PAGE CONTROLLER */}
                {lookupMode === 'page' && (
                  <div className="space-y-4 animate-scale-in">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                          {t.labels.selectPage}
                        </span>
                        <span className="bg-secondary text-foreground font-extrabold px-2.5 py-0.5 rounded text-xs font-mono border border-border">
                          {pageNum} / {rEngine.meta.numPages}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={rEngine.meta.numPages}
                        value={pageNum}
                        onChange={(e) => handlePageChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                        <span>1</span>
                        <span>{rEngine.meta.numPages}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. JUZ CONTROLLER */}
                {lookupMode === 'juz' && (
                  <div className="space-y-4 animate-scale-in">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                          {t.labels.selectJuz}
                        </span>
                        <span className="bg-secondary text-foreground font-extrabold px-2.5 py-0.5 rounded text-xs font-mono border border-border">
                          {juzNum} / 30
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={30}
                        value={juzNum}
                        onChange={(e) => handleJuzChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                        <span>1</span>
                        <span>30</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. MANZIL CONTROLLER (NEW!) */}
                {lookupMode === 'manzil' && (
                  <div className="space-y-4 animate-scale-in">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                          {t.labels.selectManzil}
                        </span>
                        <span className="bg-secondary text-foreground font-extrabold px-2.5 py-0.5 rounded text-xs font-mono border border-border">
                          {manzilNum} / 7
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={7}
                        value={manzilNum}
                        onChange={(e) => handleManzilChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                        <span>1</span>
                        <span>7</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. RUKU CONTROLLER (NEW!) */}
                {lookupMode === 'ruku' && (
                  <div className="space-y-4 animate-scale-in">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                          {t.labels.selectRuku}
                        </span>
                        <span className="bg-secondary text-foreground font-extrabold px-2.5 py-0.5 rounded text-xs font-mono border border-border">
                          {rukuNum} / {rEngine.meta.numRukus}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={rEngine.meta.numRukus}
                        value={rukuNum}
                        onChange={(e) => handleRukuChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                        <span>1</span>
                        <span>{rEngine.meta.numRukus}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. ABSOLUTE AYAH ID CONTROLLER */}
                {lookupMode === 'ayahId' && (
                  <div className="space-y-4 animate-scale-in">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                          {t.labels.selectAyahId}
                        </span>
                        <span className="bg-secondary text-foreground font-extrabold px-2.5 py-0.5 rounded text-xs font-mono border border-border">
                          {ayahIdVal} / {rEngine.meta.numAyahs}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={rEngine.meta.numAyahs}
                        value={ayahIdVal}
                        onChange={(e) => handleAyahIdChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                        <span>1</span>
                        <span>{rEngine.meta.numAyahs}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Micro-Navigation Controls */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handlePrevVerse}
                    disabled={ayahIdVal === 1}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded bg-background border border-border text-xs font-bold text-foreground hover:bg-secondary/45 transition-colors disabled:opacity-40 shadow-sm cursor-pointer"
                  >
                    {lang === 'ar' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                    {t.labels.prev}
                  </button>
                  <button
                    onClick={handleNextVerse}
                    disabled={ayahIdVal === rEngine.meta.numAyahs}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded bg-background border border-border text-xs font-bold text-foreground hover:bg-secondary/45 transition-colors disabled:opacity-40 shadow-sm cursor-pointer"
                  >
                    {t.labels.next}
                    {lang === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </button>
                </div>

              </div>
            </div>

            {/* String Reference Parser Tool (NEW!) */}
            <div className="glass shadow-premium rounded-lg border border-border p-5 space-y-4 animate-scale-in">
              <div className="flex items-center gap-2 text-foreground border-b border-border pb-2.5">
                <Bookmark size={14} />
                <h4 className="font-extrabold text-xs uppercase tracking-wider">{t.labels.referenceParser}</h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                {t.labels.referenceParserDesc}
              </p>
              
              <div className="space-y-3 pt-1">
                <input
                  type="text"
                  value={parseInput}
                  onChange={(e) => setParseInput(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground shadow-sm font-semibold"
                  placeholder="e.g. 2:255 or 18:110"
                />

                {parsedResult ? (
                  <div className="p-3 bg-secondary/25 border border-border rounded-md space-y-2 text-xs">
                    {parsedResult.isValid ? (
                      <div className="flex flex-col gap-1 text-foreground font-bold">
                        <div className="flex items-center justify-between">
                          <span>Resolved: {parsedResult.surahName} (Surah {parsedResult.surah})</span>
                          <span>Ayah: {parsedResult.ayah}</span>
                        </div>
                        {parsedResult.ayahTo > 0 && (
                          <span className="text-[10px] text-muted-foreground">Range detected to Ayah {parsedResult.ayahTo}</span>
                        )}
                        <button
                          onClick={applyParsedCoordinates}
                          className="mt-2 w-full bg-primary text-primary-foreground py-1.5 rounded-sm font-bold text-[10px] shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          {t.labels.applyCoordinates}
                        </button>
                      </div>
                    ) : (
                      <span className="text-red-500 font-bold">{t.labels.invalidReference}</span>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Scope Bound Details Inspector (NEW!) */}
            {lookupMode === 'page' && currentPageMeta && (
              <div className="glass shadow-premium rounded-lg border border-border p-5 space-y-4 animate-scale-in">
                <div className="flex items-center gap-2 text-foreground border-b border-border pb-2.5">
                  <Layers size={14} />
                  <h4 className="font-extrabold text-xs uppercase tracking-wider">{t.labels.ayahsOnPage} ({versesOnPage.length})</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                  {versesOnPage.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleSurahAyahChange(v.surah, v.ayah)}
                      className={`p-2 text-[10px] sm:text-xs font-bold rounded-sm border transition-all cursor-pointer text-center flex items-center justify-between ${
                        ayahIdVal === v.id
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-background border-border text-foreground hover:bg-secondary/45'
                      }`}
                    >
                      <span className="font-bold">
                        {surahTranslations[v.surah]?.transliteration} : {v.ayah}
                      </span>
                      <span className={`font-mono text-[9px] ${ayahIdVal === v.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        ID {v.id}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {lookupMode === 'juz' && currentJuzMeta && (
              <div className="glass shadow-premium rounded-lg border border-border p-5 space-y-3 animate-scale-in">
                <div className="flex items-center gap-2 text-foreground border-b border-border pb-2.5">
                  <CompassIcon size={14} />
                  <h4 className="font-extrabold text-xs uppercase tracking-wider">{t.labels.juzBoundaryDesc}</h4>
                </div>
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.firstAyah}</span>
                    <span className="font-bold text-foreground">
                      {surahTranslations[currentJuzMeta.first[0]]?.transliteration} : {currentJuzMeta.first[1]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.lastAyah}</span>
                    <span className="font-bold text-foreground">
                      {surahTranslations[currentJuzMeta.last[0]]?.transliteration} : {currentJuzMeta.last[1]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.firstAyahId}</span>
                    <span className="font-mono font-bold text-foreground">{currentJuzMeta.firstAyahId}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.lastAyahId}</span>
                    <span className="font-mono font-bold text-foreground">{currentJuzMeta.lastAyahId}</span>
                  </div>
                </div>
              </div>
            )}

            {lookupMode === 'manzil' && currentManzilMeta && (
              <div className="glass shadow-premium rounded-lg border border-border p-5 space-y-3 animate-scale-in">
                <div className="flex items-center gap-2 text-foreground border-b border-border pb-2.5">
                  <Layers size={14} />
                  <h4 className="font-extrabold text-xs uppercase tracking-wider">{t.labels.manzilBoundaryDesc}</h4>
                </div>
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.firstAyah}</span>
                    <span className="font-bold text-foreground">
                      {surahTranslations[currentManzilMeta.first[0]]?.transliteration} : {currentManzilMeta.first[1]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.lastAyah}</span>
                    <span className="font-bold text-foreground">
                      {surahTranslations[currentManzilMeta.last[0]]?.transliteration} : {currentManzilMeta.last[1]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.firstAyahId}</span>
                    <span className="font-mono font-bold text-foreground">{currentManzilMeta.firstAyahId}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.lastAyahId}</span>
                    <span className="font-mono font-bold text-foreground">{currentManzilMeta.lastAyahId}</span>
                  </div>
                </div>
              </div>
            )}

            {lookupMode === 'ruku' && currentRukuMeta && (
              <div className="glass shadow-premium rounded-lg border border-border p-5 space-y-3 animate-scale-in">
                <div className="flex items-center gap-2 text-foreground border-b border-border pb-2.5">
                  <Workflow size={14} />
                  <h4 className="font-extrabold text-xs uppercase tracking-wider">{t.labels.rukuBoundaryDesc}</h4>
                </div>
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.firstAyah}</span>
                    <span className="font-bold text-foreground">
                      {surahTranslations[currentRukuMeta.first[0]]?.transliteration} : {currentRukuMeta.first[1]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.lastAyah}</span>
                    <span className="font-bold text-foreground">
                      {surahTranslations[currentRukuMeta.last[0]]?.transliteration} : {currentRukuMeta.last[1]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.firstAyahId}</span>
                    <span className="font-mono font-bold text-foreground">{currentRukuMeta.firstAyahId}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold uppercase">{t.labels.lastAyahId}</span>
                    <span className="font-mono font-bold text-foreground">{currentRukuMeta.lastAyahId}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDE: METADATA INSPECTOR & DETAILED TABS (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Parallel Side-by-Side Recitation Alignment Comparison Dashboard */}
            <div className="glass shadow-premium rounded-lg border border-border overflow-hidden">
              <div className="bg-secondary/35 p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-start">
                <div>
                  <h3 className="font-extrabold text-foreground text-base">
                    {lang === 'ar' ? 'مقارنة محاذاة القراءات المتوازية' : 'Recitation Alignment Parallel Comparison'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === 'ar' 
                      ? 'مقارنة تفصيلية متزامنة لإحداثيات حفص وقالون وورش للآية المحددة جنباً إلى جنب' 
                      : 'Side-by-side comparative dashboard aligning Hafs, Qalun, and Warsh'}
                  </p>
                </div>
                
                {/* Active selection info badge */}
                <div className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-md text-xs font-bold font-mono tracking-wider shadow-sm flex items-center gap-1.5 border border-border">
                  <Bookmark size={12} />
                  <span>
                    {currentSurahMeta?.name} : {ayahNum}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Visual grid representing the 3 recitations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">

                  {/* Hafs Recitation Column */}
                  <div className={`flex flex-col space-y-4 p-4 rounded-lg border transition-all ${
                    riwaya === 'hafs'
                      ? 'bg-primary/[0.02] border-primary shadow-sm ring-1 ring-primary/20'
                      : 'bg-secondary/10 border-border/60 hover:bg-secondary/15'
                  }`}>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="text-start">
                        <p className="text-xs font-extrabold text-foreground leading-none">
                          {lang === 'ar' ? 'رِوايَة حَفْص' : 'Hafs Recitation'}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                          {lang === 'ar' ? 'عن عاصم الكوفي' : 'From Asim Al-Kufi'}
                        </p>
                      </div>
                      {riwaya === 'hafs' ? (
                        <span className="bg-primary text-primary-foreground text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-border animate-pulse uppercase">
                          {lang === 'ar' ? 'نشط' : 'Active'}
                        </span>
                      ) : (
                        <button
                          onClick={() => setRiwaya('hafs')}
                          className="bg-secondary text-foreground text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-border hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          {lang === 'ar' ? 'تفعيل' : 'Select'}
                        </button>
                      )}
                    </div>

                    {/* Coordinates list */}
                    {hafsCol ? (
                      <div className="space-y-2">
                        {/* Absolute Verse ID */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الرقم التسلسلي' : 'Verse ID'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.id && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">{hafsCol.id}</span>
                          </div>
                        </div>

                        {/* Page */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الصفحة' : 'Page'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.page && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('page'); handlePageChange(hafsCol.page); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {hafsCol.page}
                            </button>
                          </div>
                        </div>

                        {/* Juz */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الجزء' : 'Juz'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.juz && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('juz'); handleJuzChange(hafsCol.juz); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {hafsCol.juz}
                            </button>
                          </div>
                        </div>

                        {/* Ruku */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الركوع' : 'Ruku'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.ruku && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('ruku'); handleRukuChange(hafsCol.ruku); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {hafsCol.ruku}
                            </button>
                          </div>
                        </div>

                        {/* Manzil */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'المنزل' : 'Manzil'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.manzil && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('manzil'); handleManzilChange(hafsCol.manzil); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {hafsCol.manzil}
                            </button>
                          </div>
                        </div>

                        {/* Rub al-Hizb */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'ربع الحزب' : 'Rub al-Hizb'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.rub && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">{hafsCol.meta?.rubAlHizbId || 1}</span>
                          </div>
                        </div>

                        {/* Hizb */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الحزب' : 'Hizb'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.hizb && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">{hafsCol.meta?.hizbId || 1}</span>
                          </div>
                        </div>

                        {/* Thumun */}
                        <div className="flex justify-between items-center text-xs pb-1">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'ثمن الحزب' : 'Thumun'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.thumun && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-muted-foreground italic">N/A</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">{lang === 'ar' ? 'الآية غير متوفرة' : 'Verse not available'}</p>
                    )}

                    {/* Boundary states checklist */}
                    {hafsCol?.meta && (
                      <div className="space-y-2 pt-3 border-t border-border/40 text-[11px] font-medium text-muted-foreground">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? 'علامات الحدود' : 'Boundary Markers'}</p>
                        
                        {/* Sajdah */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${hafsCol.meta.isSajdahAyah ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isSajdah && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isSajdahAyah}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${hafsCol.meta.isSajdahAyah ? 'bg-primary' : 'bg-muted'}`} />
                        </div>

                        {/* Start Surah */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${hafsCol.meta.isStartOfSurah ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isStartSurah && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isStartOfSurah}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${hafsCol.meta.isStartOfSurah ? 'bg-primary' : 'bg-muted'}`} />
                        </div>

                        {/* Start Page */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${hafsCol.meta.isStartOfPage ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isStartPage && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isStartOfPage}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${hafsCol.meta.isStartOfPage ? 'bg-primary' : 'bg-muted'}`} />
                        </div>

                        {/* Start Juz */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${hafsCol.meta.isStartOfJuz ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isStartJuz && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isStartOfJuz}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${hafsCol.meta.isStartOfJuz ? 'bg-primary' : 'bg-muted'}`} />
                        </div>
                      </div>
                    )}

                    {/* Bounding Ranges Visualizer */}
                    {hafsCol && (
                      <div className="pt-3 border-t border-border/40 space-y-1.5">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? 'المدى البنيوي للآية' : 'Resolved Range Limits'}</p>
                        
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className={`p-1.5 bg-background border rounded ${diffs?.surahRange ? 'border-red-200 dark:border-red-950' : 'border-border/60'}`}>
                            <span className="text-[8px] text-muted-foreground block font-bold uppercase">{t.labels.scopeSurah}</span>
                            <span className="font-mono text-foreground font-extrabold">{hafsCol.surahRange[0]}-{hafsCol.surahRange[1]}</span>
                          </div>
                          <div className={`p-1.5 bg-background border rounded ${diffs?.pageRange ? 'border-red-200 dark:border-red-950' : 'border-border/60'}`}>
                            <span className="text-[8px] text-muted-foreground block font-bold uppercase">{t.labels.scopePage}</span>
                            <span className="font-mono text-foreground font-extrabold">{hafsCol.pageRange[0]}-{hafsCol.pageRange[1]}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Column Quick Shift Surrounding Verses */}
                    {hafsCol && (
                      <div className="pt-3 border-t border-border/40 flex gap-2">
                        <button
                          disabled={!hafsCol.prev}
                          onClick={() => {
                            if (hafsCol.prev) handleSurahAyahChange(hafsCol.prev[0], hafsCol.prev[1]);
                          }}
                          className="flex-1 bg-background border border-border hover:border-foreground py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:hover:border-border cursor-pointer shadow-sm active:scale-95"
                        >
                          {lang === 'ar' ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
                          {lang === 'ar' ? 'السابق' : 'Prev'}
                        </button>
                        <button
                          disabled={!hafsCol.next}
                          onClick={() => {
                            if (hafsCol.next) handleSurahAyahChange(hafsCol.next[0], hafsCol.next[1]);
                          }}
                          className="flex-1 bg-background border border-border hover:border-foreground py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:hover:border-border cursor-pointer shadow-sm active:scale-95"
                        >
                          {lang === 'ar' ? 'التالي' : 'Next'}
                          {lang === 'ar' ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Qalun Recitation Column */}
                  <div className={`flex flex-col space-y-4 p-4 rounded-lg border transition-all ${
                    riwaya === 'qalun'
                      ? 'bg-primary/[0.02] border-primary shadow-sm ring-1 ring-primary/20'
                      : 'bg-secondary/10 border-border/60 hover:bg-secondary/15'
                  }`}>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="text-start">
                        <p className="text-xs font-extrabold text-foreground leading-none">
                          {lang === 'ar' ? 'رِوايَة قَالُون' : 'Qalun Recitation'}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                          {lang === 'ar' ? 'عن نافع المدني' : 'From Nafi Al-Madani'}
                        </p>
                      </div>
                      {riwaya === 'qalun' ? (
                        <span className="bg-primary text-primary-foreground text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-border animate-pulse uppercase">
                          {lang === 'ar' ? 'نشط' : 'Active'}
                        </span>
                      ) : (
                        <button
                          onClick={() => setRiwaya('qalun')}
                          className="bg-secondary text-foreground text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-border hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          {lang === 'ar' ? 'تفعيل' : 'Select'}
                        </button>
                      )}
                    </div>

                    {/* Coordinates list */}
                    {qalunCol ? (
                      <div className="space-y-2">
                        {/* Absolute Verse ID */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الرقم التسلسلي' : 'Verse ID'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.id && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">{qalunCol.id}</span>
                          </div>
                        </div>

                        {/* Page */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الصفحة' : 'Page'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.page && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('page'); handlePageChange(qalunCol.page); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {qalunCol.page}
                            </button>
                          </div>
                        </div>

                        {/* Juz */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الجزء' : 'Juz'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.juz && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('juz'); handleJuzChange(qalunCol.juz); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {qalunCol.juz}
                            </button>
                          </div>
                        </div>

                        {/* Ruku */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الركوع' : 'Ruku'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.ruku && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('ruku'); handleRukuChange(qalunCol.ruku); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {qalunCol.ruku}
                            </button>
                          </div>
                        </div>

                        {/* Manzil */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'المنزل' : 'Manzil'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.manzil && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('manzil'); handleManzilChange(qalunCol.manzil); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {qalunCol.manzil}
                            </button>
                          </div>
                        </div>

                        {/* Rub al-Hizb */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'ربع الحزب' : 'Rub al-Hizb'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.rub && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">{qalunCol.meta?.rubAlHizbId || 1}</span>
                          </div>
                        </div>

                        {/* Hizb */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الحزب' : 'Hizb'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.hizb && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">{qalunCol.meta?.hizbId || 1}</span>
                          </div>
                        </div>

                        {/* Thumun */}
                        <div className="flex justify-between items-center text-xs pb-1">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'ثمن الحزب' : 'Thumun'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.thumun && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">{qalunCol.thumun !== null ? qalunCol.thumun : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">{lang === 'ar' ? 'الآية غير متوفرة' : 'Verse not available'}</p>
                    )}

                    {/* Boundary states checklist */}
                    {qalunCol?.meta && (
                      <div className="space-y-2 pt-3 border-t border-border/40 text-[11px] font-medium text-muted-foreground">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? 'علامات الحدود' : 'Boundary Markers'}</p>
                        
                        {/* Sajdah */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${qalunCol.meta.isSajdahAyah ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isSajdah && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isSajdahAyah}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${qalunCol.meta.isSajdahAyah ? 'bg-primary' : 'bg-muted'}`} />
                        </div>

                        {/* Start Surah */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${qalunCol.meta.isStartOfSurah ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isStartSurah && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isStartOfSurah}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${qalunCol.meta.isStartOfSurah ? 'bg-primary' : 'bg-muted'}`} />
                        </div>

                        {/* Start Page */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${qalunCol.meta.isStartOfPage ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isStartPage && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isStartOfPage}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${qalunCol.meta.isStartOfPage ? 'bg-primary' : 'bg-muted'}`} />
                        </div>

                        {/* Start Juz */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${qalunCol.meta.isStartOfJuz ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isStartJuz && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isStartOfJuz}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${qalunCol.meta.isStartOfJuz ? 'bg-primary' : 'bg-muted'}`} />
                        </div>
                      </div>
                    )}

                    {/* Bounding Ranges Visualizer */}
                    {qalunCol && (
                      <div className="pt-3 border-t border-border/40 space-y-1.5">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? 'المدى البنيوي للآية' : 'Resolved Range Limits'}</p>
                        
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className={`p-1.5 bg-background border rounded ${diffs?.surahRange ? 'border-red-200 dark:border-red-950' : 'border-border/60'}`}>
                            <span className="text-[8px] text-muted-foreground block font-bold uppercase">{t.labels.scopeSurah}</span>
                            <span className="font-mono text-foreground font-extrabold">{qalunCol.surahRange[0]}-{qalunCol.surahRange[1]}</span>
                          </div>
                          <div className={`p-1.5 bg-background border rounded ${diffs?.pageRange ? 'border-red-200 dark:border-red-950' : 'border-border/60'}`}>
                            <span className="text-[8px] text-muted-foreground block font-bold uppercase">{t.labels.scopePage}</span>
                            <span className="font-mono text-foreground font-extrabold">{qalunCol.pageRange[0]}-{qalunCol.pageRange[1]}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Column Quick Shift Surrounding Verses */}
                    {qalunCol && (
                      <div className="pt-3 border-t border-border/40 flex gap-2">
                        <button
                          disabled={!qalunCol.prev}
                          onClick={() => {
                            if (qalunCol.prev) handleSurahAyahChange(qalunCol.prev[0], qalunCol.prev[1]);
                          }}
                          className="flex-1 bg-background border border-border hover:border-foreground py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:hover:border-border cursor-pointer shadow-sm active:scale-95"
                        >
                          {lang === 'ar' ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
                          {lang === 'ar' ? 'السابق' : 'Prev'}
                        </button>
                        <button
                          disabled={!qalunCol.next}
                          onClick={() => {
                            if (qalunCol.next) handleSurahAyahChange(qalunCol.next[0], qalunCol.next[1]);
                          }}
                          className="flex-1 bg-background border border-border hover:border-foreground py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:hover:border-border cursor-pointer shadow-sm active:scale-95"
                        >
                          {lang === 'ar' ? 'التالي' : 'Next'}
                          {lang === 'ar' ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Warsh Recitation Column */}
                  <div className={`flex flex-col space-y-4 p-4 rounded-lg border transition-all ${
                    riwaya === 'warsh'
                      ? 'bg-primary/[0.02] border-primary shadow-sm ring-1 ring-primary/20'
                      : 'bg-secondary/10 border-border/60 hover:bg-secondary/15'
                  }`}>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="text-start">
                        <p className="text-xs font-extrabold text-foreground leading-none">
                          {lang === 'ar' ? 'رِوايَة وَرْش' : 'Warsh Recitation'}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                          {lang === 'ar' ? 'عن نافع المدني' : 'From Nafi Al-Madani'}
                        </p>
                      </div>
                      {riwaya === 'warsh' ? (
                        <span className="bg-primary text-primary-foreground text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-border animate-pulse uppercase">
                          {lang === 'ar' ? 'نشط' : 'Active'}
                        </span>
                      ) : (
                        <button
                          onClick={() => setRiwaya('warsh')}
                          className="bg-secondary text-foreground text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-border hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          {lang === 'ar' ? 'تفعيل' : 'Select'}
                        </button>
                      )}
                    </div>

                    {/* Coordinates list */}
                    {warshCol ? (
                      <div className="space-y-2">
                        {/* Absolute Verse ID */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الرقم التسلسلي' : 'Verse ID'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.id && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">{warshCol.id}</span>
                          </div>
                        </div>

                        {/* Page */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الصفحة' : 'Page'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.page && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('page'); handlePageChange(warshCol.page); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {warshCol.page}
                            </button>
                          </div>
                        </div>

                        {/* Juz */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الجزء' : 'Juz'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.juz && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('juz'); handleJuzChange(warshCol.juz); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {warshCol.juz}
                            </button>
                          </div>
                        </div>

                        {/* Ruku */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الركوع' : 'Ruku'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.ruku && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('ruku'); handleRukuChange(warshCol.ruku); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {warshCol.ruku}
                            </button>
                          </div>
                        </div>

                        {/* Manzil */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'المنزل' : 'Manzil'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.manzil && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <button
                              onClick={() => { setLookupMode('manzil'); handleManzilChange(warshCol.manzil); }}
                              className="font-mono font-bold text-foreground hover:underline transition-all"
                            >
                              {warshCol.manzil}
                            </button>
                          </div>
                        </div>

                        {/* Rub al-Hizb */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'ربع الحزب' : 'Rub al-Hizb'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.rub && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">{warshCol.meta?.rubAlHizbId || 1}</span>
                          </div>
                        </div>

                        {/* Hizb */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-border/40">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'الحزب' : 'Hizb'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.hizb && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">{warshCol.meta?.hizbId || 1}</span>
                          </div>
                        </div>

                        {/* Thumun */}
                        <div className="flex justify-between items-center text-xs pb-1">
                          <span className="text-muted-foreground font-semibold">{lang === 'ar' ? 'ثمن الحزب' : 'Thumun'}</span>
                          <div className="flex items-center gap-1.5">
                            {diffs?.thumun && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full animate-pulse border bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-900/60 shadow-sm leading-none">
                                <span className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
                                {lang === 'ar' ? 'خلاف' : 'diff'}
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">{warshCol.thumun !== null ? warshCol.thumun : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">{lang === 'ar' ? 'الآية غير متوفرة' : 'Verse not available'}</p>
                    )}

                    {/* Boundary states checklist */}
                    {warshCol?.meta && (
                      <div className="space-y-2 pt-3 border-t border-border/40 text-[11px] font-medium text-muted-foreground">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? 'علامات الحدود' : 'Boundary Markers'}</p>
                        
                        {/* Sajdah */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${warshCol.meta.isSajdahAyah ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isSajdah && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isSajdahAyah}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${warshCol.meta.isSajdahAyah ? 'bg-primary' : 'bg-muted'}`} />
                        </div>

                        {/* Start Surah */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${warshCol.meta.isStartOfSurah ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isStartSurah && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isStartOfSurah}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${warshCol.meta.isStartOfSurah ? 'bg-primary' : 'bg-muted'}`} />
                        </div>

                        {/* Start Page */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${warshCol.meta.isStartOfPage ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isStartPage && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isStartOfPage}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${warshCol.meta.isStartOfPage ? 'bg-primary' : 'bg-muted'}`} />
                        </div>

                        {/* Start Juz */}
                        <div className={`p-1.5 rounded flex items-center justify-between transition-colors ${warshCol.meta.isStartOfJuz ? 'bg-primary/5 text-foreground font-bold border border-primary/20' : 'bg-secondary/15'}`}>
                          <span className="flex items-center gap-1">
                            {diffs?.isStartJuz && (
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping inline-block" />
                            )}
                            {t.labels.isStartOfJuz}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${warshCol.meta.isStartOfJuz ? 'bg-primary' : 'bg-muted'}`} />
                        </div>
                      </div>
                    )}

                    {/* Bounding Ranges Visualizer */}
                    {warshCol && (
                      <div className="pt-3 border-t border-border/40 space-y-1.5">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? 'المدى البنيوي للآية' : 'Resolved Range Limits'}</p>
                        
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className={`p-1.5 bg-background border rounded ${diffs?.surahRange ? 'border-red-200 dark:border-red-950' : 'border-border/60'}`}>
                            <span className="text-[8px] text-muted-foreground block font-bold uppercase">{t.labels.scopeSurah}</span>
                            <span className="font-mono text-foreground font-extrabold">{warshCol.surahRange[0]}-{warshCol.surahRange[1]}</span>
                          </div>
                          <div className={`p-1.5 bg-background border rounded ${diffs?.pageRange ? 'border-red-200 dark:border-red-950' : 'border-border/60'}`}>
                            <span className="text-[8px] text-muted-foreground block font-bold uppercase">{t.labels.scopePage}</span>
                            <span className="font-mono text-foreground font-extrabold">{warshCol.pageRange[0]}-{warshCol.pageRange[1]}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Column Quick Shift Surrounding Verses */}
                    {warshCol && (
                      <div className="pt-3 border-t border-border/40 flex gap-2">
                        <button
                          disabled={!warshCol.prev}
                          onClick={() => {
                            if (warshCol.prev) handleSurahAyahChange(warshCol.prev[0], warshCol.prev[1]);
                          }}
                          className="flex-1 bg-background border border-border hover:border-foreground py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:hover:border-border cursor-pointer shadow-sm active:scale-95"
                        >
                          {lang === 'ar' ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
                          {lang === 'ar' ? 'السابق' : 'Prev'}
                        </button>
                        <button
                          disabled={!warshCol.next}
                          onClick={() => {
                            if (warshCol.next) handleSurahAyahChange(warshCol.next[0], warshCol.next[1]);
                          }}
                          className="flex-1 bg-background border border-border hover:border-foreground py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:hover:border-border cursor-pointer shadow-sm active:scale-95"
                        >
                          {lang === 'ar' ? 'التالي' : 'Next'}
                          {lang === 'ar' ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
                        </button>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ==================================================== */}
        {/* VIEW CODE PLAYGROUND SECTION                         */}
        {/* ==================================================== */}
        <section className="glass shadow-premium rounded-lg border border-border overflow-hidden text-start">
          <div className="bg-secondary/35 p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary text-foreground border border-border rounded">
                <CodeIcon size={16} />
              </div>
              <div>
                <h3 className="font-extrabold text-foreground text-sm">
                  {t.labels.codePlayground}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.labels.codePlaygroundDesc}
                </p>
              </div>
            </div>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground font-extrabold text-xs px-4 py-2.5 rounded transition-all shadow-sm active:scale-95 cursor-pointer hover:opacity-90"
            >
              {copied ? <Check size={14} className="font-bold" /> : <Copy size={14} />}
              <span>{copied ? t.labels.copied : t.labels.copyCode}</span>
            </button>
          </div>

          <div className="p-6 bg-black/90 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed overflow-x-auto border-t border-border">
            <pre className="whitespace-pre">{generatedCode}</pre>
          </div>
        </section>

      </div>
    </div>
  );
}
