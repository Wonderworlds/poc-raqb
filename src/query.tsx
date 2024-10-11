import type {
  BuilderProps,
  Config,
  ImmutableTree,
  JsonGroup,
} from '@react-awesome-query-builder/mui'; // for TS example
import { Builder, MuiConfig, Utils as QbUtils, Query } from '@react-awesome-query-builder/mui';
import '@react-awesome-query-builder/mui/css/styles.css';
import React, { useCallback, useState } from 'react';
// >>>
// or import '@react-awesome-query-builder/ui/css/compact_styles.css';
const InitialConfig = MuiConfig;
// <<<

// You need to provide your own config. See below 'Config format'
const config: Config = {
  ...InitialConfig,
  settings: {
    ...InitialConfig.settings,
    locale: {
      moment: 'fr',
    },
    valueLabel: 'Valeur',
    valuePlaceholder: 'Valeur',
    fieldLabel: 'Filtre',
    fieldPlaceholder: 'Filtre',
    operatorLabel: 'Opérateur',
    operatorPlaceholder: 'Opérateur',
    funcLabel: 'Fonction',
    funcPlaceholder: 'Fonction',
    addGroupLabel: 'Ajouter un groupe',
    addRuleLabel: 'Ajouter un filtre',
    delGroupLabel: 'Supprimer le groupe',
    showNot: false, // disable not
    maxNesting: 1, //disable Group
    forceShowConj: true,
    canReorder: false,
    setOpOnChangeField: ['keep', 'default'],
    customFieldSelectProps: {
      showSearch: true,
    },
    shouldCreateEmptyGroup: false,
    valueSourcesPopupTitle: 'Sélectionner la source de valeur',
    removeRuleConfirmOptions: {
      title: 'Etes-vous sûr de vouloir supprimer cette règle?',
      okText: 'Oui',
      okType: 'danger',
    },
    removeGroupConfirmOptions: {
      title: 'Etes-vous sûr de vouloir supprimer ce groupe?',
      okText: 'Oui',
      okType: 'danger',
    },
  },
  conjunctions: {
    AND: { ...InitialConfig.conjunctions.AND, label: 'ET' },
  },
  operators: {
    ...InitialConfig.operators,
    between: { ...InitialConfig.operators.between, label: 'Entre' },
    not_between: { ...InitialConfig.operators.between, label: 'Pas Entre' },
    is_null: { ...InitialConfig.operators.is_null, label: 'est null' },
    is_not_null: { ...InitialConfig.operators.is_not_null, label: 'est pas null' },
  },
  fields: {
    client: {
      label: 'Client',
      tooltip: 'filtre lié au client',
      type: '!group',
      subfields: {
        gender: {
          label: 'Genre',
          type: 'select',
          valueSources: ['value'],
          fieldSettings: {
            listValues: [
              { value: 'F', title: 'Femme' },
              { value: 'M', title: 'Homme' },
            ],
          },
        },
        nationality: {
          label: 'Nationalité',
          type: 'select',
          valueSources: ['value'],
          fieldSettings: {
            listValues: [
              { value: 'DE', title: 'Allemagne' },
              { value: 'FR', title: 'France' },
            ],
          },
        },
        language: {
          label: 'Langue',
          type: 'select',
          valueSources: ['value'],
          fieldSettings: {
            listValues: [
              { value: 'EN', title: 'Anglais' },
              { value: 'FR', title: 'Français' },
              { value: 'ES', title: 'Espagnol' },
              { value: 'IT', title: 'Italien' },
            ],
          },
        },
      },
    },
    reservation: {
      label: 'Réservation',
      tooltip: 'filtre lié à la réservation',
      type: '!group',
      subfields: {
        last_stay: {
          label: 'Dernier séjour',
          type: '!group',
          subfields: {
            start: {
              label: 'Début',
              type: 'date',
              valueSources: ['value'],
            },
            end: {
              label: 'Fin',
              type: 'date',
              valueSources: ['value'],
            },
            OTA: {
              label: 'OTA',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                listValues: [
                  { value: 'Booking', title: 'Booking' },
                  { value: 'Expedia', title: 'Expedia' },
                  { value: 'Airbnb', title: 'Airbnb' },
                ],
              },
            },
          },
        },
        next_stay: {
          label: 'Prochain séjour',
          type: '!group',
          subfields: {
            start: {
              label: 'Début',
              type: 'date',
              valueSources: ['value'],
            },
            end: {
              label: 'Fin',
              type: 'date',
              valueSources: ['value'],
            },
          },
        },
        duration: {
          label: 'Nombre de nuits',
          type: 'number',
          valueSources: ['value'],
          fieldSettings: {
            min: 1,
            max: 100,
          },
          preferWidgets: ['slider'],
        },
        last: {
          label: 'Dernier',
          type: 'boolean',
          operators: ['equal'],
          valueSources: ['value'],
        },
      },
    },
  },
};

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const jsonlogicStr =
  '{"and":[{"==":[{"var":"gender"},"F"]},{"==":[{"var":"nationality"},"DE"]},{"==":[{"var":"language"},"EN"]},{"==":[{"var":"language"},"ES"]},{"==":[{"var":"language"},"IT"]},{"==":[{"var":"gender"},"M"]},{"==":[{"var":"gender"},"M"]},{"==":[{"var":"gender"},"M"]},{"==":[{"var":"gender"},"M"]}]}';
const queryValue: JsonGroup = { id: QbUtils.uuid(), type: 'group' };
const DemoQueryBuilder: React.FC = () => {
  const [state, setState] = useState({
    tree:
      QbUtils.loadTree(queryValue) || QbUtils.loadFromJsonLogic(JSON.parse(jsonlogicStr), config),
    // tree:
    //   QbUtils.loadFromJsonLogic(JSON.parse(jsonlogicStr), config) || QbUtils.loadTree(queryValue),
    config: config,
  });

  const onChange = useCallback((immutableTree: ImmutableTree, config: Config) => {
    // Tip: for better performance you can apply `throttle` - see `packages/examples/src/demo`
    setState((prevState) => ({ ...prevState, tree: immutableTree, config: config }));

    const jsonTree = QbUtils.getTree(immutableTree);
    console.log(jsonTree);
    const jsonLogic = QbUtils.jsonLogicFormat(immutableTree, config);
    console.log(jsonLogic);
    // `jsonTree` can be saved to backend, and later loaded to `queryValue`
  }, []);

  const renderBuilder = useCallback(
    (props: BuilderProps) => (
      <div className="query-builder-container" style={{ padding: '10px' }}>
        <div className="query-builder qb-lite">
          <Builder {...props} />
        </div>
      </div>
    ),
    []
  );

  return (
    <div>
      <Query {...config} value={state.tree} onChange={onChange} renderBuilder={renderBuilder} />
      <div className="query-builder-result">
        <div>
          Query string: <pre>{JSON.stringify(QbUtils.queryString(state.tree, state.config))}</pre>
        </div>
        <div>
          MongoDb query:{' '}
          <pre>{JSON.stringify(QbUtils.mongodbFormat(state.tree, state.config))}</pre>
        </div>
        <div>
          JsonLogic: <pre>{JSON.stringify(QbUtils.jsonLogicFormat(state.tree, state.config))}</pre>
        </div>
      </div>
    </div>
  );
};
export default DemoQueryBuilder;
