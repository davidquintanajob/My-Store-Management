import { Modal, NativeSyntheticEvent, Text, View } from "react-native";

export const addProductoModal = (isModalVisible: boolean, toggleModal: (event: NativeSyntheticEvent<any>) => void) =>{
    return(
        <View>
            <Modal
              transparent={true}
              visible={isModalVisible}
              animationType="fade"
              onRequestClose={toggleModal}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
                }}
              >
                <View
                  style={{
                    width: 250,
                    padding: 20,
                    backgroundColor: "white",
                    borderRadius: 10,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                >
                    <Text>HOLA MUNDO</Text>
                </View>
              </View>
            </Modal>
        </View>
    );
}