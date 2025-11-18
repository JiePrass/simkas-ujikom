import { EventCard } from "@/components/event-card";
import { FilterModal } from "@/components/modal/filter-modal";
import { SearchBar } from "@/components/search-bar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllEvents } from "@/lib/api/event";
import { useRouter } from "expo-router";
import { BellIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "card");
  const iconColor = useThemeColor({}, "icon");
  const primaryColor = useThemeColor({}, "primary");
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [timeFilter, setTimeFilter] = useState("Semua");
  const [priceFilter, setPriceFilter] = useState("Semua");

  const eventTypes = ["Semua", "Seminar", "Webinar", "Workshop", "Jobfair", "Kompetisi", "Lainnya"];
  const [activeType, setActiveType] = useState<string>("Semua");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();

        setEvents(data);
      } catch (err) {
        console.error("Gagal memuat event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events
    .filter((e) =>
      activeType === "Semua" ? true : e.eventType?.toLowerCase() === activeType.toLowerCase()
    )
    .filter((e) =>
      search === "" ? true : e.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((e) => {
      if (timeFilter === "Akan Datang") return new Date(e.date) > new Date();
      if (timeFilter === "Sudah Lewat") return new Date(e.date) < new Date();
      return true;
    })
    .filter((e) => {
      if (priceFilter === "Gratis") return e.price === 0;
      if (priceFilter === "< 25.000") return e.price < 25000;
      if (priceFilter === "< 50.000") return e.price < 50000;
      if (priceFilter === "< 100.000") return e.price < 100000;
      if (priceFilter === "Berbayar") return e.price > 0;
      return true;
    });



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ThemedView style={styles.mainContainer}>
          {/* HERO */}
          <ThemedView style={styles.heroContainer}>
            <View style={styles.heroTextContainer}>
              <ThemedText type="title" style={[styles.heroTitle, { color: textColor }]}>
                Temukan
              </ThemedText>
              <ThemedText type="title" style={[styles.heroTitle, { color: textColor }]}>
                Event Menarik
              </ThemedText>
            </View>

            <TouchableOpacity
              style={[styles.notificationButton, { backgroundColor: cardColor }]}
              activeOpacity={0.7}
            >
              <BellIcon size={22} color={iconColor} />
            </TouchableOpacity>
          </ThemedView>

          {/* SEARCH */}
          <View style={styles.searchContainer}>
            <SearchBar
              placeholder="Cari Event"
              value={search}
              onChangeText={setSearch}
              onFilterPress={() => setIsFilterOpen(true)}
            />
          </View>

          {/* Event Type Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
            style={{ marginTop: 16 }}
          >
            {eventTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setActiveType(type)}
                style={[
                  styles.typeButton,
                  { backgroundColor: activeType === type ? primaryColor : cardColor },
                ]}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[
                    styles.typeButtonText,
                    activeType === type && { color: textColor, fontWeight: "600" },
                    activeType !== type && { color: textColor },
                  ]}
                >
                  {type}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.gridContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={primaryColor} />
            ) : filteredEvents.length > 0 ? (
              filteredEvents.slice(0, 6).map((event) => (
                <View style={styles.gridItem} key={event.id}>
                  <EventCard event={event}  onPress={() => router.push(`/event/${event.id}`)} />
                </View>
              ))
            ) : (
              <ThemedText style={{ textAlign: "center", marginTop: 12 }}>
                Tidak ada event untuk kategori ini.
              </ThemedText>
            )}
          </View>
        </ThemedView>
      </ScrollView>

      <FilterModal
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        timeFilter={timeFilter}
        priceFilter={priceFilter}
        setTimeFilter={setTimeFilter}
        setPriceFilter={setPriceFilter}
        onApply={() => setIsFilterOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 20,
  },

  heroContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },

  heroTextContainer: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 24,
    lineHeight: 24,
  },

  notificationButton: {
    aspectRatio: 1,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    elevation: 3,
  },

  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  gridItem: {
    width: "48%",
  },

  filterScrollContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },

  typeButtonText: {
    fontSize: 14,
  },
});
