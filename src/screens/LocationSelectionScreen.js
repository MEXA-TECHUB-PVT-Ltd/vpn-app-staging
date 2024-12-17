// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Image,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CountryFlag from 'react-native-country-flag';
// import Papa from 'papaparse';
// import Images from '../constants/Image';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {region_url, server_url} from '../constants/baseUrls';
// import CustomHeader from '../components/CustomHeader';
// const LocationSelectionScreen = ({navigation}) => {
//   const [search, setSearch] = useState('');
//   const [vpnServers, setVpnServers] = useState([]);
//   const [filteredVpnServers, setFilteredVpnServers] = useState([]);
//   const [selectedVpn, setSelectedVpn] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // const getVPNServers = async () => {
//   //     console.log('call')
//   //     setLoading(true);
//   //     try {
//   //         const response = await fetch('http://www.vpngate.net/api/iphone/');
//   //         if (!response.ok) throw new Error('Network response was not ok');
//   //         const data = await response.text();

//   //         const parts = data.split('#');
//   //         if (parts.length < 2) {
//   //             throw new Error('Unexpected data format');
//   //         }

//   //         const csvString = parts[1].split('*').join('');
//   //         Papa.parse(csvString, {
//   //             header: false,
//   //             skipEmptyLines: true,
//   //             complete: (results) => {
//   //                 const csvList = results.data;
//   //                 const header = csvList[0];
//   //                 const servers = csvList.slice(1).map((row) => {
//   //                     const tempJson = {};
//   //                     for (let j = 0; j < header.length; j++) {
//   //                         tempJson[header[j]] = row[j];
//   //                     }
//   //                     return tempJson;
//   //                 });
//   //                 // setVpnServers(servers);
//   //                 // console.log('----------servers', servers)
//   //                 setFilteredVpnServers(servers);
//   //                 setLoading(false); // Hide loading spinner after fetching
//   //             },
//   //         });
//   //     } catch (error) {
//   //         console.error('Error fetching or processing data:', error);
//   //         setLoading(false); // Hide loading spinner on error
//   //     }
//   // };

//   // const getVPNServers = async () => {
//   //     console.log('call');
//   //     setLoading(true);
//   //     try {
//   //         const response = await fetch('http://www.vpngate.net/api/iphone/');
//   //         if (!response.ok) throw new Error('Network response was not ok');
//   //         const data = await response.text();

//   //         const parts = data.split('#');
//   //         if (parts.length < 2) {
//   //             throw new Error('Unexpected data format');
//   //         }

//   //         const csvString = parts[1].split('*').join('');
//   //         Papa.parse(csvString, {
//   //             header: false,
//   //             skipEmptyLines: true,
//   //             complete: async (results) => {
//   //                 const csvList = results.data;
//   //                 const header = csvList[0];
//   //                 const servers = csvList.slice(1).map((row) => {
//   //                     const tempJson = {};
//   //                     for (let j = 0; j < header.length; j++) {
//   //                         tempJson[header[j]] = row[j];
//   //                     }
//   //                     return tempJson;
//   //                 });

//   //                 // Fetch region data for each server based on IP
//   //                 const serversWithRegion = await Promise.all(
//   //                     servers.map(async (server) => {
//   //                         const ip = server.IP; // Extract IP from server
//   //                         if (ip) {
//   //                             // const regionResponse = await fetch(`https://ipinfo.io/${ip}/json`);
//   //                             const regionResponse = await fetch(`https://ipwhois.app/json/${ip}`);
//   //                             const regionData = await regionResponse.json();
//   //                             // Combine the original server data with the region data
//   //                             return { ...server, region: regionData.region };
//   //                         }
//   //                         return server; // Return the server as-is if no IP
//   //                     })
//   //                 );
//   //                 // console.log('SERVER-----------------', serversWithRegion)
//   //                 setFilteredVpnServers(serversWithRegion);
//   //                 setLoading(false); // Hide loading spinner after fetching
//   //             },
//   //         });
//   //     } catch (error) {
//   //         console.error('Error fetching or processing data:', error);
//   //         setLoading(false); // Hide loading spinner on error
//   //     }
//   // };

//   const getVPNServers = async () => {
//     console.log('call');
//     setLoading(true);

//     try {
//       // Check if VPN servers are already stored in AsyncStorage
//       const cachedData = await AsyncStorage.getItem('vpnServers');
//       if (cachedData) {
//         // Use cached data
//         const parsedServers = JSON.parse(cachedData);
//         setFilteredVpnServers(parsedServers);
//         setLoading(false); // Stop loading as the data is already available
//         return;
//       }
//       console.log('storage data hai????', cachedData);
//       // If no cached data, call the API
//       const response = await fetch(server_url);
//       // const response = await fetch('http://www.vpngate.net/api/iphone/');
//       if (!response.ok) throw new Error('Network response was not ok');
//       const data = await response.text();

//       const parts = data.split('#');
//       if (parts.length < 2) {
//         throw new Error('Unexpected data format');
//       }

//       const csvString = parts[1].split('*').join('');
//       Papa.parse(csvString, {
//         header: false,
//         skipEmptyLines: true,
//         complete: async results => {
//           const csvList = results.data;
//           const header = csvList[0];
//           const servers = csvList.slice(1).map(row => {
//             const tempJson = {};
//             for (let j = 0; j < header.length; j++) {
//               tempJson[header[j]] = row[j];
//             }
//             return tempJson;
//           });

//           // Fetch region data for each server based on IP
//           const serversWithRegion = await Promise.all(
//             servers.map(async server => {
//               const ip = server.IP; // Extract IP from server
//               if (ip) {
//                 const regionResponse = await fetch(region_url + `${ip}`);
//                 const regionData = await regionResponse.json();
//                 // Combine the original server data with the region data
//                 return {...server, region: regionData.region};
//               }
//               return server; // Return the server as-is if no IP
//             }),
//           );
//           // Store the fetched servers with region data in AsyncStorage
//           await AsyncStorage.setItem(
//             'vpnServers',
//             JSON.stringify(serversWithRegion),
//           );
//           // Set the state with the fetched data
//           setFilteredVpnServers(serversWithRegion);
//           setLoading(false); // Hide loading spinner after fetching
//         },
//       });
//     } catch (error) {
//       setLoading(false); // Hide loading spinner on error
//     }
//   };

//   useEffect(() => {
//     getVPNServers();
//   }, []);

//   const reloadServers = () => {
//     getVPNServers();
//   };

//   // Utility to determine signal strength based on speed
//   const getSignalStrength = speed => {
//     if (speed > 1000000000) {
//       return 4; // Strong signal
//     } else if (speed > 500000000) {
//       return 3; // Good signal
//     } else if (speed > 100000000) {
//       return 2; // Moderate signal
//     } else {
//       return 1; // Weak signal
//     }
//   };
//   // Function to render signal bars based on signal strength
//   const renderSignalBars = signalStrength => {
//     const bars = [];
//     for (let i = 1; i <= 4; i++) {
//       bars.push(
//         <View
//           key={i}
//           style={[
//             styles.signalBar,
//             {height: 10 * i},
//             // { opacity: i <= signalStrength ? 1 : 0.1 } // Dim the bars based on signal strength
//             i <= signalStrength ? styles.activeBar : styles.inactiveBar,
//           ]}
//         />,
//       );
//     }
//     return bars;
//   };

//   const handleSearch = text => {
//     setSearch(text);
//     const filtered = filteredVpnServers.filter(vpn => {
//       const country = vpn.CountryLong ? vpn.CountryLong.toLowerCase() : '';
//       const ip = vpn.IP ? vpn.IP.toLowerCase() : '';
//       return (
//         country.includes(text.toLowerCase()) || ip.includes(text.toLowerCase())
//       );
//     });
//     setFilteredVpnServers(filtered);
//   };

//   const handleLocationSelect = location => {
//     setSelectedVpn(location);
//     navigation.navigate('HomeScreen', {selectedVpn: location});
//   };

//   const renderVpnItem = ({item}) => {
//     // Calculate the signal strength for the current item
//     const signalStrength = item ? getSignalStrength(item.Speed) : 1;

//     return (
//       <TouchableOpacity
//         style={[
//           styles.locationItem,
//           selectedVpn?.HostName === item.HostName &&
//             styles.selectedLocationItem,
//         ]}
//         onPress={() => handleLocationSelect(item)}>
//         <View style={styles.locationInfo}>
//           <CountryFlag isoCode={item.CountryShort} size={34} />
//           <View style={styles.locationDetails}>
//             <Text style={styles.locationText}>{item.CountryLong}</Text>
//             <Text style={styles.cityText}>{item.region}</Text>
//           </View>
//         </View>
//         {/* Render the signal bars based on signal strength */}
//         <View style={styles.signalBarsContainer}>
//           {renderSignalBars(signalStrength)}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <CustomHeader
//         leftComponent={
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={{backgroundColor: '#6D6C69', borderRadius: 30, padding: 5}}>
//             <Image source={Images.back} />
//           </TouchableOpacity>
//         }
//         middleComponent={
//           <Text
//             style={{color: 'orange', fontSize: 18, fontFamily: 'Poppins-Bold'}}>
//             Change Location
//           </Text>
//         }
//       />
//       <View style={styles.searchContainer}>
//         <Image source={Images.Search} />

//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search"
//           placeholderTextColor="#888"
//           value={search}
//           onChangeText={handleSearch}
//         />
//       </View>
//       {loading ? (
//         <View style={{flex: 1, justifyContent: 'center'}}>
//           <ActivityIndicator size="large" color="orange" />
//         </View>
//       ) : (
//         <FlatList
//           data={filteredVpnServers}
//           keyExtractor={item => item.HostName}
//           renderItem={renderVpnItem}
//           contentContainerStyle={styles.listContainer}
//         />
//       )}
//       <TouchableOpacity style={styles.reloadButton} onPress={reloadServers}>
//         {/* <Text style={styles.buttonText}>Reload</Text> */}

//         <Ionicons name="reload-circle" color={'orange'} size={60} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1c161b',
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//   },
//   title: {
//     fontSize: 20,
//     color: 'orange',
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#333',
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     marginTop: 20,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     color: 'white',
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   locationItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     backgroundColor: '#FFFFFF1A',
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   selectedLocationItem: {
//     backgroundColor: 'orange',
//   },
//   locationInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationDetails: {
//     marginLeft: 10,
//   },
//   locationText: {
//     color: '#DBD6CE',
//     fontSize: 16,
//     fontFamily: 'Poppins-Medium',
//   },
//   cityText: {
//     color: '#DBD6CE',
//     fontSize: 14,
//     fontFamily: 'Poppins-Light',
//   },
//   reloadButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     borderRadius: 40,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   signalBarsContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     marginTop: 1,
//   },
//   // Single signal bar style
//   signalBar: {
//     width: 6,
//     backgroundColor: '#00ff00',
//     marginHorizontal: 2,
//   },
//   activeBar: {
//     backgroundColor: 'green',
//   },
//   inactiveBar: {
//     backgroundColor: '#ccc',
//   },
// });

// export default LocationSelectionScreen;




import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryFlag from 'react-native-country-flag';
import Papa from 'papaparse';
import Images from '../constants/Image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { region_url, server_url } from '../constants/baseUrls';
import CustomHeader from '../components/CustomHeader';

const LocationSelectionScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [vpnServers, setVpnServers] = useState([]);
  const [filteredVpnServers, setFilteredVpnServers] = useState([]);
  const [selectedVpn, setSelectedVpn] = useState(null);
  const [loading, setLoading] = useState(true);

  const getVPNServers = async () => {
    setLoading(true);
    try {
      const cachedData = await AsyncStorage.getItem('vpnServers');
      console.log('vpnServers-----', cachedData);
  
      if (cachedData) {
        const parsedServers = JSON.parse(cachedData);
        setVpnServers(parsedServers);
        setFilteredVpnServers(parsedServers);
        setLoading(false);
        return;
      }
  
      // Fetch VPN servers from the network
      const response = await fetch(server_url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.text();
      const parts = data.split('#');
      console.log('Fetched data parts:', parts);
  
      if (parts.length < 2) throw new Error('Unexpected data format');
  
      const csvString = parts[1].replace(/\*/g, '');
      Papa.parse(csvString, {
        header: false,
        skipEmptyLines: true,
        complete: async (results) => {
          const csvList = results.data;
          console.log('CSV list:', csvList);
  
          const header = csvList[0];
          const servers = csvList.slice(1).map((row) => {
            const tempJson = {};
            header.forEach((key, index) => {
              tempJson[key] = row[index];
            });
            return tempJson;
          });
  
          const serversWithRegion = await Promise.all(
            servers.map(async (server) => {
              if (server.IP) {
                const regionResponse = await fetch(`${region_url}${server.IP}`);
                const regionData = await regionResponse.json();
                return { ...server, region: regionData.region };
              }
              return server;
            })
          );
  
          await AsyncStorage.setItem('vpnServers', JSON.stringify(serversWithRegion));
          setVpnServers(serversWithRegion);
          setFilteredVpnServers(serversWithRegion);
          setLoading(false);
        },
      });
    } catch (error) {
      setLoading(false);
      console.error('Error fetching VPN servers:', error);
    }
  };
  

  useEffect(() => {
    getVPNServers();
  }, []);

  const reloadServers = () => {
    AsyncStorage.removeItem('vpnServers');
    console.log('reolve')
    getVPNServers();
  };


  const getSignalStrength = (speed) => {
    if (speed > 1_000_000_000) return 4;
    if (speed > 500_000_000) return 3;
    if (speed > 100_000_000) return 2;
    return 1;
  };

  const renderSignalBars = (signalStrength) => {
    return Array.from({ length: 4 }, (_, index) => (
      <View
        key={index}
        style={[
          styles.signalBar,
          { height: 10 * (index + 1) },
          index + 1 <= signalStrength ? styles.activeBar : styles.inactiveBar,
        ]}
      />
    ));
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = vpnServers.filter((vpn) => {
      const country = vpn.CountryLong?.toLowerCase() || '';
      const ip = vpn.IP?.toLowerCase() || '';
      return country.includes(text.toLowerCase()) || ip.includes(text.toLowerCase());
    });
    setFilteredVpnServers(filtered);
  };

  const handleLocationSelect = (location) => {
    setSelectedVpn(location);
    navigation.navigate('HomeScreen', { selectedVpn: location });
  };

  const renderVpnItem = ({ item }) => {
    const signalStrength = getSignalStrength(item.Speed);

    return (
      <TouchableOpacity
        style={[
          styles.locationItem,
          selectedVpn?.HostName === item.HostName && styles.selectedLocationItem,
        ]}
        onPress={() => handleLocationSelect(item)}
      >
        <View style={styles.locationInfo}>
          <CountryFlag isoCode={item.CountryShort} size={34} />
          <View style={styles.locationDetails}>
            <Text style={styles.locationText}>{item.CountryLong}</Text>
            <Text style={styles.cityText}>{item.region}</Text>
          </View>
        </View>
        <View style={styles.signalBarsContainer}>{renderSignalBars(signalStrength)}</View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        leftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image source={Images.back} />
          </TouchableOpacity>
        }
        middleComponent={
          <Text style={styles.headerTitle}>Change Location</Text>
        }
      />
      <View style={styles.searchContainer}>
        <Image source={Images.Search} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#888"
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="orange" />
        </View>
      ) : (
        <FlatList
          data={filteredVpnServers}
          keyExtractor={(item) => item.HostName}
          renderItem={renderVpnItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity style={styles.reloadButton} onPress={reloadServers}>
        <Ionicons name="reload-circle" color="orange" size={60} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c161b',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    backgroundColor: '#6D6C69',
    borderRadius: 30,
    padding: 5,
  },
  headerTitle: {
    color: 'orange',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  searchInput: {
    flex: 1,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF1A',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedLocationItem: {
    backgroundColor: 'orange',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDetails: {
    marginLeft: 10,
  },
  locationText: {
    color: '#DBD6CE',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  cityText: {
    color: '#DBD6CE',
    fontSize: 14,
    fontFamily: 'Poppins-Light',
  },
  reloadButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 40,
  },
  signalBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  signalBar: {
    width: 6,
    marginHorizontal: 2,
  },
  activeBar: {
    backgroundColor: 'green',
  },
  inactiveBar: {
    backgroundColor: '#ccc',
  },
});

export default LocationSelectionScreen;
