import { LOOT_TABLE } from '../logic/lootSystem';
import { getTerminalStage, TERMINAL_STAGES, CRAFTING_RECIPES } from '../logic/upgradeSystem';
import { HapticPatterns } from '../logic/haptics';
import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import PixelIcon from '../components/PixelIcon';
import RetroAlert from '../components/RetroAlert';

export const TrophyScreen = ({ theme, onBack, unlockedItems, inventory = [], addItem, consumeItems, useConsumable }) => {
    const [activeTab, setActiveTab] = useState('ARTIFACTS');
    const [retroAlert, setRetroAlert] = useState({ visible: false, title: '', message: '', type: 'info', onConfirm: () => { } });

    // Group inventory by ID and count
    const inventoryCounts = inventory.reduce((acc, itemId) => {
        acc[itemId] = (acc[itemId] || 0) + 1;
        return acc;
    }, {});

    const salvageItems = Object.keys(inventoryCounts).map(itemId => {
        const def = LOOT_TABLE.find(i => i.id === itemId);
        return {
            ...def,
            count: inventoryCounts[itemId]
        };
    }).filter(i => i.name); // Filter nulls

    const handleCraft = (recipe) => {
        // Double check requirements
        const canCraft = recipe.ingredients.every(ing => (inventoryCounts[ing.itemId] || 0) >= ing.count);
        if (!canCraft) {
            HapticPatterns.error();
            return;
        }

        HapticPatterns.unlock();
        // 1. Consume Ingredients
        const toConsume = [];
        recipe.ingredients.forEach(ing => {
            for (let k = 0; k < ing.count; k++) toConsume.push(ing.itemId);
        });
        consumeItems(toConsume);

        // 2. Add Result
        addItem(recipe.resultId);
    };

    // Artifacts from Inventory (Special LOOT items like Nokia 3210)
    const inventoryArtifacts = Object.keys(inventoryCounts).map(itemId => {
        const def = LOOT_TABLE.find(i => i.id === itemId);
        if (!def || def.type !== 'ARTIFACT') return null;
        return {
            id: def.id,
            title: def.name, // Map name to title for consistency
            description: def.description,
            icon: def.icon,
            year: def.description.match(/\((\d{4})\)/)?.[1] || '????', // Extract year from description or default
            count: inventoryCounts[itemId]
        };
    }).filter(Boolean);

    // Combine Achievements + Inventory Artifacts
    const allMuseumItems = [...unlockedItems, ...inventoryArtifacts];

    const renderArtifacts = () => (
        <ScrollView contentContainerStyle={styles.grid}>
            {allMuseumItems.map((item, index) => (
                <View key={item.id + index} style={[styles.artifactCard, { borderColor: theme.textSecondary, backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                    <View style={styles.iconContainer}>
                        <PixelIcon name={item.icon} size={48} />
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={[styles.itemTitle, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                            {item.title}
                            {item.count > 1 && <Text style={{ fontSize: 12, color: theme.accent }}> x{item.count}</Text>}
                        </Text>
                        {item.year && (
                            <Text style={[styles.itemYear, { color: theme.accent, fontFamily: theme.fontFamily }]}>
                                EST. {item.year}
                            </Text>
                        )}
                        <Text style={[styles.itemDesc, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                            {item.description}
                        </Text>
                    </View>
                </View>
            ))}
            {allMuseumItems.length === 0 && (
                <View style={styles.emptyState}>
                    <PixelIcon name="bit" size={80} style={{ opacity: 0.5 }} />
                    <Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                        NO ARTIFACTS FOUND
                    </Text>
                </View>
            )}
        </ScrollView>
    );

    const currentStage = useMemo(() => getTerminalStage(inventory), [inventory]);

    const renderSalvage = () => (
        <ScrollView contentContainerStyle={styles.grid}>
            {/* Visual Rack Status */}
            <View style={[styles.rackContainer, { borderColor: theme.accent }]}>
                <View style={[styles.rackVisual, { backgroundColor: '#000' }]}>
                    {/* Placeholder for complex ASCII or Pixel Art based on currentStage.visual */}
                    {/* For now, a simple text based graphic */}
                    <Text style={{ fontFamily: theme.fontFamily, color: theme.accent, fontSize: 8, lineHeight: 10 }}>
                        {currentStage.visual === 'rack_empty' &&
                            `
+----------------+
|                |
|   [EMPTY]      |
|                |
+----------------+
`
                        }
                        {currentStage.visual === 'rack_wired' &&
                            `
+----------------+
|  | | | | | |   |
|  [WIRING...]   |
|  | | | | | |   |
+----------------+
`
                        }
                        {currentStage.visual === 'rack_power' &&
                            `
+----------------+
|  [||||||||||]  |
|  [POWER OK  ]  |
|  [||||||||||]  |
+----------------+
`
                        }
                        {currentStage.visual === 'rack_motherboard' &&
                            `
+----------------+
|  [ MOTHERBD ]  |
|  [....::::::]  |
|  [:.:.:.:.:.]  |
+----------------+
`
                        }
                        {currentStage.visual === 'rack_core' &&
                            `
+----------------+
|  [  CPU 01  ]  |
|  [RAM][RAM]    |
|  [::::::::::]  |
+----------------+
`
                        }
                        {currentStage.visual === 'rack_online' &&
                            `
+----------------+
|  [ SERVER ]    |
|  [||||||||] OK |
|  [CONNECTED]   |
+----------------+
`
                        }
                        {currentStage.visual === 'rack_cluster' &&
                            `
+----------------+
| [[SERVER-01]]  |
| [[SERVER-02]]  |
| [[SERVER-03]]  |
+----------------+
`
                        }
                        {currentStage.visual === 'rack_quantum' &&
                            `
+----------------+
|  [ QUANTUM ]   |
|  (  ATOM  )    |
|  [~FLUX~]      |
+----------------+
`
                        }
                        {currentStage.visual === 'rack_ai' &&
                            `
+----------------+
|   [ NEURAL ]   |
|   (  O  )      |
|   thinking...  |
+----------------+
`
                        }
                        {currentStage.visual === 'rack_time' &&
                            `
+----------------+
|  [ FLUX CAP ]  |
|  < 88 MPH >    |
|  [1985][2026]  |
+----------------+
`
                        }
                        {currentStage.visual === 'rack_god' &&
                            `
+----------------+
|  [OMNISCIENT]  |
|  (( O ))       |
|  I SEE ALL     |
+----------------+
`
                        }
                    </Text>
                </View>
                <View style={styles.rackInfo}>
                    <Text style={[styles.rackTitle, { fontFamily: theme.fontFamily, color: theme.textPrimary }]}>
                        {currentStage.name.toUpperCase()}
                    </Text>
                    <Text style={[styles.rackLevel, { fontFamily: theme.fontFamily, color: theme.textSecondary }]}>
                        LEVEL {currentStage.level}
                    </Text>
                </View>
            </View>

            {/* Recipes / Work Bench */}
            <View style={{ marginBottom: 20 }}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                    WORKBENCH
                </Text>
                {CRAFTING_RECIPES.map(recipe => {
                    // Check if craftable
                    const canCraft = recipe.ingredients.every(ing => (inventoryCounts[ing.itemId] || 0) >= ing.count);
                    const resultItem = LOOT_TABLE.find(i => i.id === recipe.resultId) || { name: recipe.resultId };

                    return (
                        <TouchableOpacity
                            key={recipe.id}
                            style={[styles.recipeCard, { borderColor: canCraft ? theme.accent : '#333', opacity: canCraft ? 1 : 0.5 }]}
                            disabled={!canCraft}
                            onPress={() => handleCraft(recipe)}
                        >
                            <View>
                                <Text style={[styles.recipeTitle, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                                    BUILD: {resultItem.name}
                                </Text>
                                <Text style={[styles.recipeDesc, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                                    {recipe.description}
                                </Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                                    {recipe.ingredients.map((ing, idx) => {
                                        const has = inventoryCounts[ing.itemId] || 0;
                                        const name = LOOT_TABLE.find(i => i.id === ing.itemId)?.name || ing.itemId;
                                        const color = has >= ing.count ? theme.accent : '#666';
                                        return (
                                            <Text key={idx} style={{ fontSize: 10, color: color, marginRight: 10, fontFamily: theme.fontFamily }}>
                                                {has}/{ing.count} {name}
                                            </Text>
                                        );
                                    })}
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20 }}>🔨</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                INVENTORY
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                CONSUMABLES
            </Text>
            {salvageItems.filter(i => i.type === 'CONSUMABLE').map((item) => (
                <View key={item.id} style={[styles.artifactCard, { borderColor: theme.accent, backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(50,255,50,0.1)' }]}>
                        <PixelIcon name={item.icon} size={32} />
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.itemTitle, { color: theme.accent, fontFamily: theme.fontFamily }]}>{item.name}</Text>
                            <Text style={[styles.itemTitle, { color: '#FFF', fontFamily: theme.fontFamily }]}>x{item.count}</Text>
                        </View>
                        <Text style={[styles.itemDesc, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>{item.description}</Text>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-start', marginTop: 10, padding: 8, backgroundColor: theme.accent, borderRadius: 4 }}
                            onPress={() => {
                                setRetroAlert({
                                    visible: true,
                                    title: "USE ITEM",
                                    message: `Consume ${item.name}?`,
                                    confirmText: "USE",
                                    onCancel: () => setRetroAlert(prev => ({ ...prev, visible: false })),
                                    onConfirm: () => {
                                        setRetroAlert(prev => ({ ...prev, visible: false }));
                                        if (useConsumable) {
                                            const result = useConsumable(item.id);
                                            setTimeout(() => {
                                                if (result.success) {
                                                    HapticPatterns.unlock();
                                                    setRetroAlert({
                                                        visible: true,
                                                        title: "ACTIVATED",
                                                        message: result.effect || 'Item consumed!',
                                                        type: 'achievement',
                                                        onConfirm: () => setRetroAlert(prev => ({ ...prev, visible: false }))
                                                    });
                                                } else {
                                                    HapticPatterns.error();
                                                    setRetroAlert({
                                                        visible: true,
                                                        title: "FAILED",
                                                        message: "Could not use item.",
                                                        onConfirm: () => setRetroAlert(prev => ({ ...prev, visible: false }))
                                                    });
                                                }
                                            }, 300);
                                        }
                                    }
                                });
                            }}
                        >
                            <Text style={{ fontFamily: theme.fontFamily, color: '#000', fontSize: 10 }}>USE ITEM</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: theme.fontFamily, marginTop: 20 }]}>
                SCRAP COMPONENTS
            </Text>

            {salvageItems.filter(i => i.type !== 'CONSUMABLE').map((item) => (
                <View key={item.id} style={[styles.artifactCard, { borderColor: theme.textSecondary, backgroundColor: 'rgba(0,0,0,0.3)', opacity: 0.8 }]}>
                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
                        <PixelIcon name={item.icon} size={32} />
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.itemTitle, { color: theme.textPrimary, fontFamily: theme.fontFamily, fontSize: 14 }]}>
                                {item.name}
                            </Text>
                            <Text style={[styles.itemTitle, { color: theme.accent, fontFamily: theme.fontFamily, fontSize: 14 }]}>
                                x{item.count}
                            </Text>
                        </View>
                        <Text style={[styles.itemDesc, { color: theme.textSecondary, fontFamily: theme.fontFamily, fontSize: 10 }]}>
                            {item.description}
                        </Text>
                        <View style={{ marginTop: 4, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#333', alignSelf: 'flex-start', borderRadius: 4 }}>
                            <Text style={{ fontSize: 8, color: '#FFF' }}>{item.tier}</Text>
                        </View>
                    </View>
                </View>
            ))}
            {salvageItems.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={{ fontSize: 40 }}>🏚</Text>
                    <Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                        SCRAPYARD EMPTY
                    </Text>
                    <Text style={[styles.emptySub, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                        SOLVE EQUATIONS TO SALVAGE PARTS
                    </Text>
                </View>
            )}
        </ScrollView>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={[styles.backText, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                        {"< BACK"}
                    </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                    <TouchableOpacity onPress={() => setActiveTab('ARTIFACTS')}>
                        <Text style={[styles.title, {
                            color: activeTab === 'ARTIFACTS' ? theme.accent : theme.textSecondary,
                            fontFamily: theme.fontFamily,
                            textDecorationLine: activeTab === 'ARTIFACTS' ? 'underline' : 'none'
                        }]}>
                            MUSEUM
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('SALVAGE')}>
                        <Text style={[styles.title, {
                            color: activeTab === 'SALVAGE' ? theme.accent : theme.textSecondary,
                            fontFamily: theme.fontFamily,
                            textDecorationLine: activeTab === 'SALVAGE' ? 'underline' : 'none'
                        }]}>
                            INVENTORY & SCRAP
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {activeTab === 'ARTIFACTS' ? renderArtifacts() : renderSalvage()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#333',
    },
    backButton: {
        padding: 10,
    },
    backText: {
        fontSize: 14,
    },
    title: {
        fontSize: 24,
    },
    grid: {
        padding: 20,
        gap: 20,
    },
    artifactCard: {
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 40,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        marginBottom: 4,
    },
    itemYear: {
        fontSize: 12,
        marginBottom: 4,
        opacity: 0.8,
    },
    itemDesc: {
        fontSize: 12,
        lineHeight: 16,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
        gap: 20,
    },
    emptyText: {
        fontSize: 18,
    },
    emptySub: {
        fontSize: 12,
        textAlign: 'center',
        maxWidth: 200,
    },
    rackContainer: {
        borderWidth: 2,
        padding: 10,
        marginBottom: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    rackVisual: {
        width: 100,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    rackInfo: {
        flex: 1,
    },
    rackTitle: {
        fontSize: 16,
        marginBottom: 5,
    },
    rackLevel: {
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 14,
        marginBottom: 10,
        letterSpacing: 1,
    },
    recipeCard: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    recipeTitle: {
        fontSize: 14,
        marginBottom: 2,
    },
    recipeDesc: {
        fontSize: 10,
        opacity: 0.8,
    }
});
