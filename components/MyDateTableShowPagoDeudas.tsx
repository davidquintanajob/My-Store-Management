import * as React from "react";
import { DataTable } from "react-native-paper";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Colors } from "../styles/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { getValorMonedaUSD } from "../services/MonedaService";
import { useUsuario } from "../contexts/UsuarioContext";

export interface PagoDeudaShowModal {
  id_pago_deuda: string;
  pagada: string;
  fecha: string;
}

interface Props {
  items: PagoDeudaShowModal[];
  columns: string[];
  onButtonPress: (item: PagoDeudaShowModal) => void;
}

export const MyDateTablePagoDeudaWithButton: React.FC<Props> = ({
  items,
  columns,
  onButtonPress,
}) => {
  const [cambioMoneda, setCambioMoneda] = React.useState(0);
const { usuario, setUsuario } = useUsuario();
  const [scale] = React.useState(new Animated.Value(1));
  const [page, setPage] = React.useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(5);
  const [displayedItems, setDisplayedItems] = React.useState<PagoDeudaShowModal[]>(
    []
  );

  React.useEffect(() => {
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);
    setDisplayedItems(items.slice(from, to));
  }, [page, items, itemsPerPage]);

  useFocusEffect(
      React.useCallback(() => {
        const runEffects = async () => {
          // cargar cambio de moneda
          setCambioMoneda(await getValorMonedaUSD(usuario.token));
        };
        runEffects();
  
        return () => {
          // Código que se ejecuta cuando se cierra la interfaz
        };
      }, [])
    );

  const handleChangePage = (newPage: number) => {
    if (newPage >= 0 && newPage * itemsPerPage < items.length) {
      setPage(newPage);
    }
  };

  const showTableColumns = () => (
    <DataTable.Header style={{ justifyContent: "space-between" }}>
      {columns.map((column, index) => (
        <DataTable.Title
          key={index}
          style={[styles.headerColumn, { flex: 1 }]}
          numeric={index > 1}
        >
          <Text style={styles.headerTextDesktop}>{column}</Text>
        </DataTable.Title>
      ))}
      <DataTable.Title style={styles.headerColumn}>
        <Text style={styles.headerTextDesktop}>Acción</Text>
      </DataTable.Title>
    </DataTable.Header>
  );

  return (
    <View style={styles.containerDesktop}>
      <DataTable style={{ width: "100%" }}>
        {showTableColumns()}

        {displayedItems.map((item) => (
          <DataTable.Row key={item.id_pago_deuda}>
            <DataTable.Cell numeric style={styles.handerRow}>
              {(parseFloat(item.pagada) * cambioMoneda).toFixed(2)}
            </DataTable.Cell>
            <DataTable.Cell numeric style={styles.handerRow}>
              <Text>{item.fecha.split("T")[0]}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={styles.actionColumn}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onButtonPress(item)}
              >
                <Text style={styles.actionButtonText}>Eliminar</Text>
              </TouchableOpacity>
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
            disabled={page === 0}
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
            disabled={(page + 1) * itemsPerPage >= items.length}
          >
            <Text style={styles.paginationLabel}>Próxima</Text>
          </TouchableOpacity>
        </View>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  containerDesktop: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "2%",
  },
  headerTextDesktop: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerColumn: {
    justifyContent: "center",
  },
  handerRow: {
    fontSize: 14,
    justifyContent: "center",
    fontWeight: "bold",
  },
  actionColumn: {
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: Colors.rojo_oscuro,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  actionButtonText: {
    color: Colors.blanco,
    fontWeight: "bold",
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  paginationButtonMovil: {
    backgroundColor: Colors.azul_Suave,
    borderRadius: 20,
    width: "30%",
    height: 40,
    marginHorizontal: "3%",
    alignItems: "center",
    justifyContent: "center",
  },
  paginationLabel: {
    fontSize: 14,
    color: Colors.negro,
  },
  disabledButton: {
    backgroundColor: Colors.blanco_Suave,
  },
});
