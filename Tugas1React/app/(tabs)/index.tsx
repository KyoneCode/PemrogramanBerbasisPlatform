// nama: Hadyan Kholish Prasetio
// nim: 24060123140197


import React, {useState} from 'react';
import {View, Image, ImageBackground, Text, TextInput, TouchableOpacity, Button, Alert} from 'react-native';

const FlexDimensionsBasics = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    const trimmed = email.trim().toLowerCase();
    console.log('handleSubmit called', { selected, email: trimmed });

    if (!selected) {
      Alert.alert('Pilih calon', 'Silakan pilih calon terlebih dahulu.');
      return;
    }
    const undipDomain = '@students.undip.ac.id';
    if (!trimmed || !trimmed.endsWith(undipDomain)) {
      Alert.alert('Email tidak valid', `Masukkan email UNDIP dengan akhiran ${undipDomain} (wajib).`);
      return;
    }
    const nama = selected === 1 ? 'Calon 1' : 'Calon 2';
    Alert.alert('Terima kasih sudah berpartisipasi', `${trimmed} memilih ${nama}`);
  };

  return (

    <View style={{flex: 1}}>
{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Banner~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <ImageBackground
        source={require('../../assets/images/Banner.jpg')}
        style={{width: '100%', flex: 0.5, justifyContent: 'center', alignItems: 'center'}}
        // imageStyle={{transform: [{translateY: -160}]}} kalo di web ga pake ini jadi jelek :v
        resizeMode="cover"
      >
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)'}} />
        <Image
          source={require('../../assets/images/hmif.png')}
          style={{width: 120, height: 120}}
          resizeMode="contain"
        />
        <Text style={{color: '#ffffff', marginTop: 8, fontSize: 16, fontWeight: '600'}}>Pemilihan Ketua HMIF 2026</Text>
      </ImageBackground>
{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Garis~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <View style={{flex: 0.04, backgroundColor: '#273138ff'}} />
      
{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~isi~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <View style={{flex: 1, backgroundColor: '#161c20ff', padding: 16}}>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
          <View style={{flex: 0.48, alignItems: 'center', marginTop: 12}}>
            <Image
              source={require('../../assets/images/foto1.jpg')}
              style={{width: 140, height: 180, borderRadius: 8}}
              resizeMode="cover"
            />
            <Text style={{color: '#ffffff', marginTop: 8}}>Hadyan Kholish Prasetio</Text>
          </View>

          <View style={{flex: 0.48, alignItems: 'center', marginTop: 12}}>
            <Image
              source={require('../../assets/images/foto2.jpg')}
              style={{width: 140, height: 180, borderRadius: 8}}
              resizeMode="cover"
            />
            <Text style={{color: '#ffffff', marginTop: 8}}>Mas. 19jt lapangan</Text>
          </View>
        </View>

        <View>
{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ini radio button pure gpt pak hehe~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12}}>
            <TouchableOpacity onPress={() => setSelected(1)} style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 8}}>
                {selected === 1 && <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#ffffff'}} />}
              </View>
              <Text style={{color: '#ffffff'}}>Calon 1</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelected(2)} style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 8}}>
                {selected === 2 && <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#ffffff'}} />}
              </View>
              <Text style={{color: '#ffffff'}}>Calon 2</Text>
            </TouchableOpacity>
          </View>
{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~text input~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <Text style={{color: '#ffffff', marginTop: 12, marginBottom: 8}}>Email (wajib):</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email@students.undip.ac.id"
            placeholderTextColor="#888"
            keyboardType="email-address"
            style={{backgroundColor: '#ffffff', padding: 8, borderRadius: 6, marginBottom: 12}}
          />
{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~submit~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <View style={{marginTop: 0}}>
            <Button title="Kirim!!" onPress={handleSubmit} color="#4caf50" />
          </View>
        </View>
      </View>
    </View>
  );
};  

export default FlexDimensionsBasics;