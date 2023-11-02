import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NOMINATIM_BASE_URL = `https://nominatim.openstreetmap.org/search?`;

export default function App() {

  const [searchString, setSearchString] = useState('');

  const [locationInfo, setLocationInfo] = useState([]);

  const handleLocationSearch = () => {
    const params = {
      q: searchString,
      format: 'json',
      addressdetails: 1,
      limit: 40
    }

    const requestedOptions = {
      method: 'GET',
      redirect: 'follow'
    }

    const queryString = new URLSearchParams(params).toString();

    fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestedOptions)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        let x = data.map((val, i) => {
          return {
            osm_id: val.osm_id,
            display_name: val.display_name,
            city: val.address?.city,
            lat: val.lat,
            lon: val.lon
          };
        })
        console.log(x);
        setLocationInfo(x);
      })
      .catch((err) => console.log(err.message));
  }

  const Item = ({ osm_id, display_name, lat, lon }) => (
    <Pressable
      android_ripple={{
        color: 'gray'
      }}
      onPress={() => console.log(lat, lon)}
      style={{
        padding: 10
      }}
    >
      <Text>{display_name}</Text>
      <Text>Latitude: {Number(lat).toPrecision(6)}, Longitude: {Number(lon).toPrecision(6)}</Text>
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <Item
      osm_id={item.osm_id}
      display_name={item.display_name}
      lat={item.lat}
      lon={item.lon}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: '50%' }}>
      <StatusBar style="auto" />

      <View style={styles.container}>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={{
              height: 40,
              padding: 10,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 5,
            }}
            onChangeText={text => {
              setSearchString(text);
              // handleLocationSearch();
            }}
            onSubmitEditing={handleLocationSearch}
            value={searchString}
            placeholder="Enter your location manually"
            placeholderTextColor={'gray'}
          />

          <Ionicons
            name="ios-search-circle"
            size={35}
            style={{ backgroundColor: 'black', marginLeft: 5, borderRadius: 5 }}
            color="white"
            onPress={handleLocationSearch}
          />
        </View>

        <FlatList
          data={locationInfo}
          renderItem={renderItem}
          keyExtractor={item => item.osm_id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
