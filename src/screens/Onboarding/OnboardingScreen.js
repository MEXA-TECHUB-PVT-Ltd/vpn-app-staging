// import React from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
// import Onboarding from "react-native-onboarding-swiper";
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
//   } from "react-native-responsive-screen";
// import { useNavigation } from "@react-navigation/native";
// import Images from "../../constants/Image";

// const Dots = ({ selected }) => {
//   let backgroundColor = selected ? "rgba(255, 165, 0, 0.8)" : "white";
//   let width = selected ? 30 : 10; // Set width based on selection

//   return (
//     <View
//       style={{
//         width, // Dynamically set width
//         height: 10, // Height remains the same
//         marginHorizontal: 3,
//         backgroundColor,
//         borderRadius: 10, // Rounded corners
//       }}
//     />
//   );
// };

// const Skip = ({ ...props }) => (
//   <TouchableOpacity
//     style={{
//       marginHorizontal: 10,
//       backgroundColor: "#FF9900", // Button background color
//       borderRadius: 20, // Rounded corners
//       paddingVertical: 8,
//       paddingHorizontal: 15,
//     }}
//     {...props}
//   >
//     <Text style={styles.NextStyle}>Skip</Text>
//   </TouchableOpacity>
// );

// const Next = ({ ...props }) => (
//   <TouchableOpacity
//     style={{
//       marginHorizontal: 10,
//       backgroundColor: "#FF9900", // Button background color
//       borderRadius: 20, // Rounded corners
//       paddingVertical: 8,
//       paddingHorizontal: 15,
//     }}
//     {...props}
//   >
//     <Text style={styles.NextStyle}>Next</Text>
//   </TouchableOpacity>
// );

// const Done = ({ ...props }) => (
//   <TouchableOpacity
//     style={{
//       marginHorizontal: 10,
//       backgroundColor: "#FF9900", // Button background color
//       borderRadius: 20, // Rounded corners
//       paddingVertical: 8,
//       paddingHorizontal: 15,
//     }}
//     {...props}
//   >
//     <Text style={styles.NextStyle}>Done</Text>
//   </TouchableOpacity>
// );

// const OnboardingScreen = () => {
//   const navigation = useNavigation();
//   return (
//     <Onboarding
//       SkipButtonComponent={Skip}
//       NextButtonComponent={Next}
//       DoneButtonComponent={Done}
//       DotComponent={Dots}
//       onSkip={() => navigation.replace("LoginScreen")}
//       onDone={() => navigation.replace("LoginScreen")}
//       pages={[
//         {
//           backgroundColor: "#1c161b",
//           image: <Image source={Images.slider1} style={styles.imamgestyle} />,
//           title: "Connect in One Tap",
//           subtitle: "Set up and connect effortlessly with a user-friendly interface",
//           titleStyles: { color: "#FF9900", fontFamily: "Poppins-SemiBold", fontSize:18, },
//           subTitleStyles: { color: "#FFAD33", fontFamily: "Poppins-Regular", fontSize:14,},
//         },
//         {
//           backgroundColor: "#1c161b",
//           image: <Image source={Images.slider2}  style={styles.imamgestyle}/>,
//           title: "Stream and Surf Seamlessly",
//           subtitle: "Enjoy blazing-fast connection speeds for uninterrupted browsing.",
//           titleStyles: { color: "#FF9900", fontFamily: "Poppins-SemiBold", fontSize:18, },
//           subTitleStyles: { color: "#FFAD33", fontFamily: "Poppins-Regular", fontSize:14, },
//         },
//         {
//           backgroundColor: "#1c161b",
//           image: <Image source={Images.slider3}  style={styles.imamgestyle}/>,
//           title: "Unblock Your World",
//           subtitle: "Access your favorite websites and apps from anywhere, anytime.",
//           titleStyles: { color: "#FF9900", fontFamily: "Poppins-SemiBold", fontSize:18, },
//           subTitleStyles: { color: "#FFAD33" , fontFamily: "Poppins-Regular", fontSize:14,},
//         },
//         {
//           backgroundColor: "#1c161b",
//           image: <Image source={Images.slider4}  style={styles.imamgestyle}/>,
//           title: "Browse Without Limits",
//           subtitle: "Protect your online activity with top-notch security.",
//           titleStyles: { color: "#FF9900", fontFamily: "Poppins-SemiBold", fontSize:18, },
//           subTitleStyles: { color: "#FFAD33", fontFamily: "Poppins-Regular" , fontSize:14,},
//         },
//       ]}
//     />
//   );
// };

// export default OnboardingScreen;
// const styles = StyleSheet.create({
//   NextStyle: {
//     fontSize: 16,
//     color: "#FFFFFF",
//     fontFamily: "Poppins-SemiBold",
//     paddingTop: 3,
//   },
//   imamgestyle:{
//     height:hp('32%'), width:wp('65%')
//   }
// });



// import React, { useState } from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Images from "../../constants/Image";

// const OnboardingScreen = () => {
//   const navigation = useNavigation();
//   const [currentPage, setCurrentPage] = useState(0);

//   const pages = [
//     {
//       image: require('../../assets/images/CupStar.png'), // Replace with your actual image path
//       heading: "Connect in One Tap",
//       description: "Set up and connect effortlessly with a user-friendly interface",
//     },
//     {
//       image: require('../../assets/images/ShieldUser.png'),
//       heading: "Stream and Surf Seamlessly",
//       description: "Enjoy blazing-fast connection speeds for uninterrupted browsing.",
//     },
//     {
//       image: require('../../assets/images/ShieldNetwork.png'),
//       heading: "Unblock Your World",
//       description: "Access your favorite websites and apps from anywhere, anytime.",
//     },
//     {
//       image: require('../../assets/images/HandStars.png'),
//       heading: "Browse Without Limits",
//       description: "Protect your online activity with top-notch security.",
//     },
//   ];

//   const handleNext = () => {
//     if (currentPage < pages.length - 1) {
//       setCurrentPage(currentPage + 1);
//     } else {
//       navigation.navigate("LoginScreen"); // Replace with your login screen name
//     }
//   };

//   const handleSkip = () => {
//     navigation.navigate("LoginScreen"); // Replace with your login screen name
//   };

//   return (
//     <View style={styles.container}>
//       {/* Logo Section */}
//       <View style={styles.imageWrapper}>
//         <Image
//           source={pages[currentPage].image}
//           style={styles.image}
//           resizeMode="contain"
//         />
//       </View>

//       {/* Text Section */}
//       <View style={styles.textWrapper}>
//         <Text style={styles.title}>{pages[currentPage].heading}</Text>
//         <Text style={styles.subtitle}>{pages[currentPage].description}</Text>
//       </View>

//       {/* Dot Indicators */}
//       <View style={styles.dotsWrapper}>
//         {pages.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.dot,
//               currentPage === index ? styles.activeDot : null,
//             ]}
//           />
//         ))}
//       </View>

//       {/* Buttons */}
//       <View style={styles.buttonWrapper}>
//         <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
//           <Text style={styles.nextButtonText}>
//             {currentPage === pages.length - 1 ? "Finish" : "Next"}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleSkip}>
//           <Text style={styles.skipButtonText}>Skip</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#1e1e1e", // Dark background
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingBottom:20
//   },
//   imageWrapper: {
//     flex: 3,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   image: {
//     width: 250,
//     height: 250,
//   },
//   textWrapper: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 18,
//     color: "#FFC107", // Yellow color
//     textAlign: "center",
//     fontFamily: "Poppins-Bold",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#FFC107", // White subtitle
//     textAlign: "center",
//     marginTop: 10,
//     fontFamily: "Poppins-SemiBold",
//   },
//   dotsWrapper: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginVertical: 20,
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "white", // Default white dots
//     marginHorizontal: 5,
//     opacity: 0.4,
//   },
//   activeDot: {
//     opacity: 1,
//     width:40,
//     backgroundColor: "#FF9900", // Active dot color
//   },
//   buttonWrapper: {
//     flex: 1,
//     justifyContent: "space-around",
//     alignItems: "center",
//     width: "100%",
//   },
//   nextButton: {
//     backgroundColor: "#FF9900", // Orange button
//     paddingHorizontal: 130,
//     paddingVertical: 15,
//     borderRadius: 30,
//   },
//   nextButtonText: {
//     fontSize: 16,
//     color: "#FFFFFF",
//     fontWeight: "bold",
//   },
//   skipButtonText: {
//     fontSize: 14,
//     color: "#FFFFFF",
//     marginTop: 10,
//   },
// });

// export default OnboardingScreen;



import React,{useRef} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const sliderRef = useRef(null);
  const slides = [
    {
      key: '1',
      title: 'Connect in One Tap',
      text: 'Set up and connect effortlessly with a user-friendly interface.',
      image: require('../../assets/images/CupStar.png'), // Replace with your own images
    },
    {
      key: '2',
      title: 'Stream and Surf Seamlessly',
      text: 'Enjoy blazing-fast connection speeds for uninterrupted browsing.',
      image: require('../../assets/images/ShieldUser.png'),
    },
    {
      key: '3',
      title: 'Unblock Your World',
      text: 'Access your favorite websites and apps from anywhere, anytime.',
      image: require('../../assets/images/ShieldNetwork.png'),
    },
    {
      key: '4',
      title: 'Browse Without Limits',
      text: 'Protect your online activity with top-notch security.',
      image: require('../../assets/images/ShieldNetwork.png'),
    },
  ];

  const renderSlide = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const handleDone = () => {
    navigation.navigate('LoginScreen'); // Navigate to Login screen
  };

  const handleSkip = () => {
    navigation.navigate('LoginScreen'); // Navigate to Login screen
  };

  const renderPagination = (activeIndex) => {
    return (
      <View style={styles.paginationContainer}>
        {/* Dots Section */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Button Section */}
        <View style={styles.buttonContainer}>
          {activeIndex !== slides.length - 1 ? (
            <TouchableOpacity style={styles.nextButton}  onPress={() => sliderRef.current.goToSlide(activeIndex + 1, true)}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextButton} onPress={handleDone}>
              <Text style={styles.buttonText}>Start Enjoying</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Skip Button Section */}
        
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        
      </View>
    );
  };

  return (
    <AppIntroSlider
  ref={sliderRef}
  renderItem={renderSlide}
  data={slides}
  renderPagination={renderPagination}
  onDone={handleDone}
  showSkipButton={false} // Handled in custom renderPagination
/>
    // <AppIntroSlider
    //   renderItem={renderSlide}
    //   data={slides}
    //   renderPagination={renderPagination}
    //   onDone={handleDone}
    //   showSkipButton={false} // Handled in custom renderPagination
    // />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal:10
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: '#FFC107',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#FFC107',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  paginationContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#1e1e1e',
    
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    opacity: 0.4,
    marginHorizontal: 5,
    marginBottom:20
  },
  activeDot: {
    opacity: 1,
    backgroundColor: '#FF9900',
    width:'8%'
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: '#FF9900',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    // fontWeight: 'bold',
     fontFamily: 'Poppins-Bold',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Poppins-Medium',
  },
});

export default OnboardingScreen;
