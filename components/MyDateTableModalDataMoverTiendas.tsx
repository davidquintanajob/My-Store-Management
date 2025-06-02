import * as React from "react";
import { DataTable } from "react-native-paper";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Button,
  Animated,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { Colors } from "../styles/Colors";
import { useNavigation } from "@react-navigation/native";

export interface TiendaMoverShowModal {
  id_tienda: string;
  nombre: string;
}

interface Props {
  items: TiendaMoverShowModal[];
  columns: string[];
}

export const MyDateTableModalDataMoverTiendas: React.FC<Props> = ({
  items,
  columns,
}) => {
  const navigation = useNavigation();
  const [scale] = React.useState(new Animated.Value(1));

  const [page, setPage] = React.useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(3);
  const [displayedItems, setDisplayedItems] = React.useState<TiendaMoverShowModal[]>(
    []
  ); // Estado para los elementos mostrados

  React.useEffect(() => {
    // Actualiza los elementos mostrados al cambiar de página
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    // Limpia los elementos actuales antes de actualizar
    setDisplayedItems([]); // Limpia los elementos de la tabla
    setTimeout(() => {
      setDisplayedItems(items.slice(from, to)); // Muestra los nuevos elementos después de un breve intervalo
    }, 0); // Opcional: puedes ajustar este tiempo si quieres un pequeño retraso visual
  }, [page, items, itemsPerPage]);

  const handleChangePage = (newPage: number) => {
    if (newPage >= 0 && newPage * itemsPerPage < items.length) {
      setPage(newPage); // Cambia de página si es válido
    }
  };

  // Función para mostrar las columnas de la tabla
  const showTableColumns = () => {
    return (
      <DataTable.Header style={{ justifyContent: "space-between" }}>
        {columns.map((column, index) => (
          <DataTable.Title
            key={index}
            style={[
              styles.headerColumn,
              {
                flex: 1,
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
            numeric={index > 1}
          >
            <Text style={styles.headerTextDesktop}>{column}</Text>
          </DataTable.Title>
        ))}
      </DataTable.Header>
    );
  };
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 1.5,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const [isModalVisible, setModalVisible] = React.useState(false);

  // Función para abrir/cerrar el modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.containerDesktop}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <DataTable style={{ width: "150%" }}>
          {showTableColumns()}

          {displayedItems.map((item) => (
            <DataTable.Row
              key={item.id_tienda}
              onPress={() => alert("Not supported yet")}
            >
              <DataTable.Cell style={styles.handerRow}>
                <Text
                  style={{ flexWrap: "wrap", width: "100%", textAlign: "left" }}
                  numberOfLines={2} // Limita a 2 líneas
                >
                  {item.nombre}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}

          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButtonMovil,
                page === 0 && styles.disabledButton,
              ]}
              onPress={() => handleChangePage(page - 1)}
              disabled={page === 0} // Desactiva el botón si es la primera página
            >
              <Text style={styles.paginationLabel}>Anterior</Text>
            </TouchableOpacity>

            <Text style={styles.paginationLabel}>
              {`${page * itemsPerPage + 1}-${Math.min(
                (page + 1) * itemsPerPage,
                items.length
              )} of ${items.length}`}
            </Text>

            <TouchableOpacity
              style={[
                styles.paginationButtonMovil,
                (page + 1) * itemsPerPage >= items.length &&
                  styles.disabledButton,
              ]}
              onPress={() => handleChangePage(page + 1)}
              disabled={(page + 1) * itemsPerPage >= items.length} // Desactiva si es la última página
            >
              <Text style={styles.paginationLabel}>Próxima</Text>
            </TouchableOpacity>
          </View>
        </DataTable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerDesktop: {
    flex: 1,
    padding: 10,
    marginTop: "2%",
    width: "100%"
  },
  containerMovil: {
    flex: 1,
    marginTop: "2%",
    marginBottom: "20%",
  },
  headerTextDesktop: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTextMovil: {
    fontSize: 12,
    fontWeight: "bold",
  },
  headerColumn: {
    justifyContent: "center",
  },
  handerRow: {
    fontSize: 16,
    justifyContent: "center",
    fontWeight: "bold",
    width: "100%",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  paginationButtonDesktop: {
    backgroundColor: Colors.azul_Suave,
    borderRadius: 20,
    width: "15%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.azul_Suave,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 3,
  },
  paginationButtonMovil: {
    backgroundColor: Colors.azul_Suave,
    borderRadius: 20,
    width: "30%",
    height: 50,
    marginHorizontal: "3%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.azul_Suave,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 3,
  },
  paginationLabel: {
    fontSize: 20,
    color: Colors.negro,
  },
  disabledButton: {
    backgroundColor: Colors.blanco_Suave,
  },
});
