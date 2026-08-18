import type { Company } from './types'

/**
 * すべて架空の企業です。実在する企業・団体・人物とは一切関係ありません。
 * デモ用にニュース・IR要約・経営陣コメント・アナリスト見解などのサンプル
 * コンテンツを収録しています。ニュースの出典も実在メディア名ではなく
 * 「情報源の種類」として汎用的なラベルを使用しています。
 */
export const companies: Company[] = [
  {
    code: '1201',
    name: 'サンプルテクノロジーズ株式会社',
    kana: 'サンプルテクノロジーズ',
    market: 'グロース',
    sector: 'ソフトウェア・SaaS',
    description:
      '中堅・中小企業向けの業務クラウドSaaSを展開する架空企業。サブスクリプション型の会計・人事労務ソフトが主力。',
    basePrice: 3120,
    driftPctAnnual: 14,
    volPctAnnual: 42,
    fundamentals: {
      marketCapOku: 890,
      per: 48.2,
      pbr: 9.8,
      roe: 21.4,
      dividendYieldPct: 0.0,
      revenueGrowthYoYPct: 27.3,
      opMarginPct: 18.1,
    },
    growthPoints: [
      '解約率(チャーンレート)が過去2年で3.1%→1.6%まで低下し、既存顧客からのアップセルが売上成長を牽引。',
      '生成AIを活用した経費仕訳の自動化機能を追加し、大企業向けプランの契約単価が上昇傾向。',
      '地方銀行との業務提携により、中小企業向け販路を拡大中。',
    ],
    riskFactors: [
      {
        title: '評価倍率(バリュエーション)の高さ',
        description:
          'PER・PBRともに同業他社平均を上回る水準で推移しており、成長鈍化時には株価変動が大きくなりやすい。',
        severity: '高',
      },
      {
        title: '人材獲得競争',
        description: 'エンジニア採用市場の競争激化により、人件費の上昇が利益率を圧迫する可能性。',
        severity: '中',
      },
      {
        title: 'セキュリティインシデントリスク',
        description: 'クラウドサービスの性質上、情報漏えい等が発生した場合の信用毀損リスクがある。',
        severity: '中',
      },
    ],
    irSummary: {
      period: '2026年第1四半期(サンプル)',
      title: '増収増益、通期計画は据え置き',
      highlights: [
        '売上高は前年同期比+27.3%、営業利益は同+31.0%',
        '有料契約社数は前四半期比+4.2%増加',
        '通期の売上・利益計画は据え置き、進捗率は過去平均並み',
      ],
      summary:
        '主力SaaSの契約社数・単価がともに伸長し増収増益。経営陣は「積み上げ型のストック収益モデルが機能している」とコメント。一方で先行投資(採用・広告宣伝費)は計画通り実行しており、四半期ベースの利益率は前四半期からやや低下した。',
    },
    managementComments: [
      {
        role: '代表取締役社長(決算説明会にて)',
        quote:
          '中小企業のDXはまだ道半ばであり、当社が提供する統合型SaaSへの需要は今後も高い水準が続くと見ている。',
        context: '四半期決算説明会での発言(要約・サンプル)',
      },
      {
        role: 'CFO(投資家向け説明会にて)',
        quote:
          '広告宣伝費は第2四半期にかけて一時的に増加するが、通期の利益率レンジに変更はない。',
        context: '投資家向け説明会Q&Aでの発言(要約・サンプル)',
      },
    ],
    analystViews: [
      { rating: '強気', targetPrice: 3800, comment: 'ストック型収益の積み上がりを評価。成長率の持続性に注目。' },
      { rating: '中立', targetPrice: 3200, comment: '成長性は評価するが、現在の株価はある程度織り込み済みと判断。' },
      { rating: '強気', targetPrice: 3650, comment: '解約率の改善トレンドが継続すれば上振れ余地あり。' },
    ],
    news: [
      {
        title: '大手地方銀行グループとの業務提携を発表',
        sourceType: '企業リリース',
        publishedAgoLabel: '2日前',
        summary: '地方銀行の取引先企業向けに、業務クラウドSaaSを共同で提案する提携を発表。',
        tone: 'ポジティブ',
      },
      {
        title: '生成AIを活用した経費仕訳自動化機能の提供を開始',
        sourceType: '専門メディア(IT)',
        publishedAgoLabel: '6日前',
        summary: '大企業向けプランにAIによる仕訳自動化機能を追加。既存顧客からの評価は概ね好意的と報じられた。',
        tone: 'ポジティブ',
      },
      {
        title: 'エンジニア採用競争の激化、人件費上昇に懸念の声も',
        sourceType: '経済メディア',
        publishedAgoLabel: '9日前',
        summary: 'SaaS業界全体でエンジニア採用コストが上昇傾向にあると指摘する記事。同社の採用計画にも言及。',
        tone: '中立',
      },
      {
        title: '四半期決算を発表、市場予想を上回る増益',
        sourceType: '経済メディア',
        publishedAgoLabel: '13日前',
        summary: '営業利益が市場予想を上回り、発表後の時間外取引で買いが優勢だったと報じられた。',
        tone: 'ポジティブ',
      },
    ],
  },
  {
    code: '1450',
    name: '架空フーズホールディングス株式会社',
    kana: 'カクウフーズホールディングス',
    market: 'プライム',
    sector: '食品',
    description:
      '加工食品・冷凍食品を中心とする総合食品メーカーの架空企業。国内シェア上位、海外展開を強化中。',
    basePrice: 2480,
    driftPctAnnual: 4,
    volPctAnnual: 18,
    fundamentals: {
      marketCapOku: 6200,
      per: 16.8,
      pbr: 1.4,
      roe: 8.6,
      dividendYieldPct: 2.6,
      revenueGrowthYoYPct: 3.8,
      opMarginPct: 7.2,
    },
    growthPoints: [
      '東南アジア向け冷凍食品の輸出が拡大しており、海外売上比率が3年前の8%から15%に上昇。',
      '値上げ後も販売数量が大きく落ち込んでおらず、価格transferが順調に進行。',
      '植物性代替肉ブランドの取り扱い店舗数が拡大中。',
    ],
    riskFactors: [
      {
        title: '原材料価格・為替の変動',
        description: '輸入原材料や包装資材のコスト変動、円安による輸入コスト増が利益率に影響しやすい。',
        severity: '中',
      },
      {
        title: '国内市場の成熟',
        description: '人口動態を背景に国内加工食品市場の伸びは緩やかで、大幅な数量成長は見込みにくい。',
        severity: '中',
      },
      {
        title: '食品安全に関するレピュテーションリスク',
        description: '品質問題が発生した場合、ブランド価値への影響が大きい業種特性がある。',
        severity: '低',
      },
    ],
    irSummary: {
      period: '2026年第2四半期(サンプル)',
      title: '価格改定の浸透により増益、海外事業が牽引',
      highlights: [
        '売上高は前年同期比+3.8%、営業利益は同+9.1%',
        '海外売上比率が前年同期の12%から15%に上昇',
        '通期配当計画を据え置き、増配余地について言及',
      ],
      summary:
        '国内は数量横ばいながら価格改定効果で増収。海外(東南アジア)の冷凍食品事業が二桁成長を継続し、全体の増益に寄与した。経営陣は株主還元方針についても言及している。',
    },
    managementComments: [
      {
        role: '代表取締役社長(決算説明会にて)',
        quote:
          '価格改定は一巡したが、ブランド力のある商品群では数量への影響が限定的だった。海外事業の成長投資は継続する。',
        context: '四半期決算説明会での発言(要約・サンプル)',
      },
      {
        role: 'IR担当役員(株主総会にて)',
        quote:
          '株主還元については配当性向のレンジを維持しつつ、機動的な自己株式取得も選択肢として検討する。',
        context: '定時株主総会での質疑応答(要約・サンプル)',
      },
    ],
    analystViews: [
      { rating: '中立', targetPrice: 2600, comment: '海外事業の伸びは評価するが、国内は横ばい基調が続くとみる。' },
      { rating: '強気', targetPrice: 2850, comment: '配当利回りの高さと海外成長のバランスが良いと評価。' },
      { rating: '中立', targetPrice: 2500, comment: '原材料コストの動向次第で利益率は変動しやすい。' },
    ],
    news: [
      {
        title: '東南アジア向け冷凍食品の輸出拡大を発表',
        sourceType: '企業リリース',
        publishedAgoLabel: '3日前',
        summary: '現地パートナー企業との販路拡大により、輸出数量を今後3年で倍増させる計画を発表。',
        tone: 'ポジティブ',
      },
      {
        title: '主力ブランドの価格改定を発表',
        sourceType: '経済メディア',
        publishedAgoLabel: '11日前',
        summary: '原材料・物流コストの上昇を受け、一部商品の価格改定を発表。市場の反応は限定的だったと報じられた。',
        tone: '中立',
      },
      {
        title: '植物性代替肉ブランドの取扱店舗が拡大',
        sourceType: '専門メディア(食品)',
        publishedAgoLabel: '15日前',
        summary: '大手スーパーチェーンでの取り扱いが拡大し、新規顧客層の獲得が進んでいると報じられた。',
        tone: 'ポジティブ',
      },
      {
        title: '一部工場での品質管理体制を強化と発表',
        sourceType: '企業リリース',
        publishedAgoLabel: '20日前',
        summary: '品質管理プロセスの見直しを実施したと発表。過去のトラブルへの再発防止策と位置づけられている。',
        tone: '中立',
      },
    ],
  },
  {
    code: '1620',
    name: 'みらい半導体装置株式会社',
    kana: 'ミライハンドウタイソウチ',
    market: 'プライム',
    sector: '半導体製造装置',
    description: '半導体前工程向け検査装置を手がける架空企業。大手ファウンドリ・メモリメーカーが主要顧客。',
    basePrice: 8900,
    driftPctAnnual: 9,
    volPctAnnual: 34,
    fundamentals: {
      marketCapOku: 4100,
      per: 22.5,
      pbr: 3.9,
      roe: 17.8,
      dividendYieldPct: 1.5,
      revenueGrowthYoYPct: 12.6,
      opMarginPct: 24.3,
    },
    growthPoints: [
      '次世代メモリ向け検査装置の受注が増加、受注残高は前年同期比+18%。',
      'AI関連の半導体投資拡大を背景に、主要顧客の設備投資計画が上方修正される動きがみられる。',
      '海外現地でのサポート体制強化によりアフターサービス収益(ストック収益)が拡大。',
    ],
    riskFactors: [
      {
        title: '半導体市況のサイクル性',
        description: '半導体設備投資は循環的な変動が大きく、業績のブレが大きくなりやすい業種特性がある。',
        severity: '高',
      },
      {
        title: '特定顧客への売上集中',
        description: '上位顧客数社への売上依存度が高く、当該顧客の投資計画変更の影響を受けやすい。',
        severity: '中',
      },
      {
        title: '地政学リスク・輸出規制',
        description: '半導体関連の輸出規制強化など、地政学的要因が事業展開に影響を及ぼす可能性がある。',
        severity: '中',
      },
    ],
    irSummary: {
      period: '2026年第1四半期(サンプル)',
      title: '受注・売上ともに堅調、通期計画を上方修正',
      highlights: [
        '受注高は前年同期比+18.4%、受注残高も過去最高水準',
        '売上高は前年同期比+12.6%、営業利益率は24.3%に改善',
        '通期営業利益計画を上方修正',
      ],
      summary:
        'AI関連投資を背景とした半導体メーカーの設備投資需要を取り込み、受注・売上ともに堅調に推移。経営陣は下期についても「顧客の投資計画に大きな減速の兆候は見られない」とコメントした。',
    },
    managementComments: [
      {
        role: '代表取締役社長(決算説明会にて)',
        quote:
          '足元の受注動向を見る限り、主要顧客の投資姿勢は積極的であり、当面は堅調な需要が続くとみている。',
        context: '四半期決算説明会での発言(要約・サンプル)',
      },
      {
        role: '技術担当役員(業界カンファレンスにて)',
        quote:
          '次世代メモリの微細化に対応した検査精度の向上が、今後の差別化の核になる。',
        context: '業界カンファレンス講演での発言(要約・サンプル)',
      },
    ],
    analystViews: [
      { rating: '強気', targetPrice: 10500, comment: 'AI関連投資サイクルの恩恵を最も受けやすい銘柄の一つと評価。' },
      { rating: '強気', targetPrice: 9800, comment: '受注残高の積み上がりが今後数四半期の業績を下支え。' },
      { rating: '中立', targetPrice: 8700, comment: '半導体市況の循環性を踏まえ、高値圏では慎重姿勢。' },
    ],
    news: [
      {
        title: '次世代メモリ向け検査装置の大型受注を獲得',
        sourceType: '企業リリース',
        publishedAgoLabel: '1日前',
        summary: '大手メモリメーカーから次世代品向け検査装置の追加受注を獲得したと発表。',
        tone: 'ポジティブ',
      },
      {
        title: '通期業績予想を上方修正',
        sourceType: '経済メディア',
        publishedAgoLabel: '5日前',
        summary: '受注の積み上がりを反映し、通期の営業利益予想を上方修正したと報じられた。',
        tone: 'ポジティブ',
      },
      {
        title: '半導体輸出管理規制の強化を巡る報道',
        sourceType: '海外通信社',
        publishedAgoLabel: '10日前',
        summary: '半導体関連の輸出管理規制強化を検討する報道があり、関連銘柄への影響が意識されたと伝えられた。',
        tone: 'ネガティブ',
      },
      {
        title: '海外拠点でのサポート人員増強を発表',
        sourceType: '企業リリース',
        publishedAgoLabel: '17日前',
        summary: 'アフターサービス体制の強化を目的に、海外拠点の人員を増強すると発表。',
        tone: '中立',
      },
    ],
  },
  {
    code: '1788',
    name: '東海メディカルサイエンス株式会社',
    kana: 'トウカイメディカルサイエンス',
    market: 'スタンダード',
    sector: '医薬品・ヘルスケア',
    description: 'ジェネリック医薬品と診断薬を手がける架空の中堅製薬企業。',
    basePrice: 1540,
    driftPctAnnual: 2,
    volPctAnnual: 22,
    fundamentals: {
      marketCapOku: 980,
      per: 14.2,
      pbr: 1.1,
      roe: 7.9,
      dividendYieldPct: 3.1,
      revenueGrowthYoYPct: 1.2,
      opMarginPct: 9.8,
    },
    growthPoints: [
      '診断薬事業で新規検査項目の保険適用が決定し、売上寄与が期待される。',
      '生産設備の自動化投資により、ジェネリック医薬品の製造原価率が改善傾向。',
      'アジア地域での医薬品販売許可の取得が進み、輸出拡大の下地が整いつつある。',
    ],
    riskFactors: [
      {
        title: '薬価改定の影響',
        description: '定期的な薬価改定により、既存製品の売上・利益率が継続的に圧迫される構造的リスクがある。',
        severity: '高',
      },
      {
        title: '品質・製造トラブルのリスク',
        description: '製造業務許可の停止など、規制対応上のトラブルが発生した場合の影響が大きい。',
        severity: '中',
      },
      {
        title: '新薬開発パイプラインの薄さ',
        description: '大手に比べ研究開発投資余力が限られ、新規収益源の育成に時間を要する可能性。',
        severity: '中',
      },
    ],
    irSummary: {
      period: '2026年第2四半期(サンプル)',
      title: '減収も原価改善で増益、配当方針は維持',
      highlights: [
        '売上高は前年同期比+1.2%とほぼ横ばい',
        '製造原価率の改善により営業利益は前年同期比+6.4%',
        '配当性向の目安を維持し、安定配当方針を継続',
      ],
      summary:
        '薬価改定の影響を製造効率化でカバーし増益を確保。診断薬事業の新規保険適用が下期以降の成長ドライバーとして期待されている。',
    },
    managementComments: [
      {
        role: '代表取締役社長(決算説明会にて)',
        quote:
          '薬価改定という構造的な逆風の中でも、製造プロセスの見直しにより収益性を維持できている。',
        context: '四半期決算説明会での発言(要約・サンプル)',
      },
      {
        role: '研究開発担当役員(株主総会にて)',
        quote:
          '診断薬の新規項目は、既存の検査ネットワークを生かして早期の普及を目指す。',
        context: '定時株主総会での質疑応答(要約・サンプル)',
      },
    ],
    analystViews: [
      { rating: '中立', targetPrice: 1600, comment: '配当利回りは魅力だが成長率は限定的とみる。' },
      { rating: '中立', targetPrice: 1550, comment: '診断薬の新規保険適用の効果を見極めたい局面。' },
      { rating: '弱気', targetPrice: 1400, comment: '薬価改定圧力が今後も続くとみられ、利益成長には慎重。' },
    ],
    news: [
      {
        title: '診断薬の新規検査項目が保険適用に',
        sourceType: '専門メディア(医療)',
        publishedAgoLabel: '4日前',
        summary: '新規開発した検査項目が公的保険の適用対象となったと報じられた。',
        tone: 'ポジティブ',
      },
      {
        title: 'アジア地域での医薬品販売許可を取得',
        sourceType: '企業リリース',
        publishedAgoLabel: '8日前',
        summary: '複数のアジア諸国で医薬品の販売許可を取得したと発表。',
        tone: 'ポジティブ',
      },
      {
        title: '薬価改定を受けた業界全体への影響を分析する記事',
        sourceType: '経済メディア',
        publishedAgoLabel: '14日前',
        summary: 'ジェネリック医薬品業界全体が薬価改定の影響を受けているとする分析記事で、同社にも言及。',
        tone: 'ネガティブ',
      },
      {
        title: '生産設備の自動化投資を発表',
        sourceType: '企業リリース',
        publishedAgoLabel: '22日前',
        summary: '主力工場における自動化投資を発表し、製造原価率の改善を見込むとした。',
        tone: '中立',
      },
    ],
  },
  {
    code: '2033',
    name: 'グリーンパワー・イノベーションズ株式会社',
    kana: 'グリーンパワーイノベーションズ',
    market: 'グロース',
    sector: '再生可能エネルギー',
    description: '太陽光・蓄電池を組み合わせた分散型エネルギーサービスを手がける架空企業。',
    basePrice: 970,
    driftPctAnnual: 6,
    volPctAnnual: 48,
    fundamentals: {
      marketCapOku: 320,
      per: 0,
      pbr: 4.2,
      roe: -3.5,
      dividendYieldPct: 0.0,
      revenueGrowthYoYPct: 34.8,
      opMarginPct: -4.1,
    },
    growthPoints: [
      '産業用蓄電池の設置件数が前年同期比+41%と急拡大。',
      '電力小売事業とのセット販売により顧客単価が上昇。',
      '自治体との再エネ導入支援に関する協定締結が増加している。',
    ],
    riskFactors: [
      {
        title: '継続的な営業赤字',
        description: '成長投資を優先し営業損益は赤字が続いており、資金調達環境の変化に業績が左右されやすい。',
        severity: '高',
      },
      {
        title: '補助金・制度変更への依存',
        description: '再エネ関連の補助金制度や電力買取制度の変更が事業採算に大きく影響する。',
        severity: '高',
      },
      {
        title: '希薄化リスク',
        description: '成長投資資金を新株発行で調達する場合、既存株主の持分が希薄化する可能性がある。',
        severity: '中',
      },
    ],
    irSummary: {
      period: '2026年第1四半期(サンプル)',
      title: '大幅増収も先行投資で営業赤字が継続',
      highlights: [
        '売上高は前年同期比+34.8%',
        '産業用蓄電池の新規設置件数が過去最高',
        '営業損益は計画通り赤字で着地、黒字化目標時期を据え置き',
      ],
      summary:
        '蓄電池・電力小売のセット販売が奏功し高い増収率を維持。一方で拠点拡大や人員採用など先行投資が継続しており、黒字化は計画通り今後数四半期先を見込むとしている。',
    },
    managementComments: [
      {
        role: '代表取締役社長(決算説明会にて)',
        quote:
          '足元は投資フェーズだが、蓄電池単価の低下と設置件数の増加により、黒字化への道筋は計画通り進んでいる。',
        context: '四半期決算説明会での発言(要約・サンプル)',
      },
      {
        role: 'CFO(投資家向け説明会にて)',
        quote:
          '資金調達については複数の選択肢を検討しており、既存株主への影響を最小化する方法を優先する。',
        context: '投資家向け説明会Q&Aでの発言(要約・サンプル)',
      },
    ],
    analystViews: [
      { rating: '強気', targetPrice: 1300, comment: '成長率の高さを評価。黒字化の進捗次第でさらなる上値余地。' },
      { rating: '弱気', targetPrice: 750, comment: '赤字継続と資金調達リスクを踏まえ、慎重な見方を維持。' },
      { rating: '中立', targetPrice: 980, comment: '成長性とリスクが拮抗しており、黒字化時期の確度を注視。' },
    ],
    news: [
      {
        title: '産業用蓄電池の新規設置件数が過去最高を更新',
        sourceType: '企業リリース',
        publishedAgoLabel: '2日前',
        summary: '四半期の新規設置件数が過去最高を更新したと発表。',
        tone: 'ポジティブ',
      },
      {
        title: '複数自治体と再エネ導入支援協定を締結',
        sourceType: '専門メディア(エネルギー)',
        publishedAgoLabel: '7日前',
        summary: '自治体向けの再エネ導入コンサルティング事業で新たな協定締結が相次いでいると報じられた。',
        tone: 'ポジティブ',
      },
      {
        title: '電力買取制度の見直し議論が進行中と報道',
        sourceType: '経済メディア',
        publishedAgoLabel: '12日前',
        summary: '再エネ電力の買取制度見直しに関する議論が進んでいると報じられ、関連銘柄の株価が反応したと伝えられた。',
        tone: 'ネガティブ',
      },
      {
        title: '新株予約権の発行を発表',
        sourceType: '企業リリース',
        publishedAgoLabel: '19日前',
        summary: '成長投資資金の調達を目的とした新株予約権の発行を発表。',
        tone: '中立',
      },
    ],
  },
  {
    code: '2210',
    name: 'さくらリテールホールディングス株式会社',
    kana: 'サクラリテールホールディングス',
    market: 'プライム',
    sector: '小売',
    description: '首都圏中心にドラッグストア・スーパーを展開する架空の小売持株会社。',
    basePrice: 4150,
    driftPctAnnual: 3,
    volPctAnnual: 20,
    fundamentals: {
      marketCapOku: 3400,
      per: 18.9,
      pbr: 1.8,
      roe: 9.7,
      dividendYieldPct: 2.1,
      revenueGrowthYoYPct: 5.4,
      opMarginPct: 4.6,
    },
    growthPoints: [
      'プライベートブランド商品の比率上昇により粗利率が改善。',
      'ネットスーパー事業の対応エリアを拡大し、EC売上が前年同期比+22%。',
      '不採算店舗の閉鎖と好立地への出店を並行し、既存店売上高が改善傾向。',
    ],
    riskFactors: [
      {
        title: '人件費・光熱費の上昇',
        description: '最低賃金の引き上げやエネルギーコストの上昇が販管費を押し上げる要因になっている。',
        severity: '中',
      },
      {
        title: '競合激化による価格競争',
        description: '同業・異業種との価格競争が続き、粗利率改善の持続性が課題となる可能性。',
        severity: '中',
      },
      {
        title: '出店余地の減少',
        description: '主要商圏での出店が進み、新規出店による成長ペースは鈍化する可能性がある。',
        severity: '低',
      },
    ],
    irSummary: {
      period: '2026年第2四半期(サンプル)',
      title: '既存店売上高が改善、EC事業が成長を牽引',
      highlights: [
        '既存店売上高は前年同期比+2.8%',
        'EC(ネットスーパー)売上高は前年同期比+22.1%',
        '不採算店舗8店舗を閉鎖、新規4店舗を出店',
      ],
      summary:
        'プライベートブランドの拡充とEC事業の成長により増収増益。経営陣は店舗網の最適化を継続しつつ、デジタル領域への投資を強化する方針を示した。',
    },
    managementComments: [
      {
        role: '代表取締役社長(決算説明会にて)',
        quote:
          '実店舗とネットスーパーを組み合わせたオムニチャネル戦略が、顧客単価の向上に寄与している。',
        context: '四半期決算説明会での発言(要約・サンプル)',
      },
      {
        role: '店舗運営担当役員(株主総会にて)',
        quote:
          '不採算店舗の見直しは一巡しつつあり、今後は既存店の生産性向上に軸足を移す。',
        context: '定時株主総会での質疑応答(要約・サンプル)',
      },
    ],
    analystViews: [
      { rating: '中立', targetPrice: 4300, comment: 'EC事業の成長は評価するが、粗利率改善の持続性を見極めたい。' },
      { rating: '強気', targetPrice: 4600, comment: 'PB比率上昇による粗利改善が続けば増益基調は継続とみる。' },
      { rating: '中立', targetPrice: 4100, comment: '人件費上昇圧力が利益率の重石になる可能性に留意。' },
    ],
    news: [
      {
        title: 'ネットスーパー対応エリアを拡大',
        sourceType: '企業リリース',
        publishedAgoLabel: '3日前',
        summary: '首都圏近郊の対応エリアを拡大し、即日配送サービスの提供地域を広げたと発表。',
        tone: 'ポジティブ',
      },
      {
        title: '既存店売上高が3カ月連続でプラスに',
        sourceType: '経済メディア',
        publishedAgoLabel: '9日前',
        summary: '月次の既存店売上高が3カ月連続でプラスとなったと報じられた。',
        tone: 'ポジティブ',
      },
      {
        title: '最低賃金引き上げの影響を試算する報道',
        sourceType: '経済メディア',
        publishedAgoLabel: '16日前',
        summary: '小売・外食業界における人件費上昇の影響を試算する記事で、同社の労働集約度の高さに言及。',
        tone: 'ネガティブ',
      },
      {
        title: '不採算店舗の閉鎖方針を発表',
        sourceType: '企業リリース',
        publishedAgoLabel: '24日前',
        summary: '収益性の低い店舗を順次閉鎖し、好立地への集中出店を進める方針を発表。',
        tone: '中立',
      },
    ],
  },
  {
    code: '2350',
    name: 'フロンティア物流株式会社',
    kana: 'フロンティアブツリュウ',
    market: 'スタンダード',
    sector: '物流',
    description: 'EC向け配送・倉庫管理サービスを手がける架空の物流企業。',
    basePrice: 1310,
    driftPctAnnual: 5,
    volPctAnnual: 26,
    fundamentals: {
      marketCapOku: 540,
      per: 13.4,
      pbr: 1.6,
      roe: 12.1,
      dividendYieldPct: 1.8,
      revenueGrowthYoYPct: 9.7,
      opMarginPct: 6.3,
    },
    growthPoints: [
      'EC事業者向けの物流アウトソーシング需要が拡大し、倉庫稼働率が上昇。',
      '自動倉庫システムの導入により、庫内作業の生産性が向上。',
      '地方拠点の新設により、配送リードタイムの短縮を実現。',
    ],
    riskFactors: [
      {
        title: '燃料費・人件費の変動',
        description: '燃料価格やドライバーの人件費上昇が輸送コストを押し上げるリスクがある。',
        severity: '中',
      },
      {
        title: '労働力不足(2024年問題の余波)',
        description: 'ドライバー不足が構造的な課題として残っており、輸送能力の制約要因となりうる。',
        severity: '中',
      },
      {
        title: '荷主企業への価格転嫁の遅れ',
        description: 'コスト上昇分を運賃に転嫁するタイミングのズレが利益率を圧迫する可能性。',
        severity: '低',
      },
    ],
    irSummary: {
      period: '2026年第1四半期(サンプル)',
      title: '倉庫稼働率の上昇により増収増益',
      highlights: [
        '売上高は前年同期比+9.7%、営業利益は同+15.2%',
        '倉庫稼働率は前年同期比+6ポイント改善',
        '運賃改定の浸透により輸送コスト上昇の影響を一部相殺',
      ],
      summary:
        'EC事業者からのアウトソーシング需要増加を背景に倉庫稼働率が向上。自動化投資の効果も出始めており、増収増益を確保した。',
    },
    managementComments: [
      {
        role: '代表取締役社長(決算説明会にて)',
        quote:
          '自動倉庫システムの投資効果が数字に表れ始めている。稼働率の高さを維持しながら生産性を追求する。',
        context: '四半期決算説明会での発言(要約・サンプル)',
      },
      {
        role: '物流事業担当役員(業界セミナーにて)',
        quote:
          'ドライバー不足という業界課題に対しては、拠点配置の見直しと共同配送の推進で対応している。',
        context: '業界セミナー講演での発言(要約・サンプル)',
      },
    ],
    analystViews: [
      { rating: '強気', targetPrice: 1500, comment: 'EC物流需要の拡大を追い風に、増益基調が続くとみる。' },
      { rating: '中立', targetPrice: 1350, comment: '労働力不足のリスクを踏まえ、輸送能力の制約に注意。' },
      { rating: '中立', targetPrice: 1300, comment: '運賃転嫁の進捗が今後の利益率を左右する。' },
    ],
    news: [
      {
        title: '自動倉庫システムの新規拠点への導入を発表',
        sourceType: '企業リリース',
        publishedAgoLabel: '5日前',
        summary: '新設拠点に自動倉庫システムを導入し、庫内作業の効率化を図ると発表。',
        tone: 'ポジティブ',
      },
      {
        title: '運賃改定の実施を発表',
        sourceType: '経済メディア',
        publishedAgoLabel: '11日前',
        summary: '燃料費上昇を受け、一部荷主向けの運賃改定を実施したと報じられた。',
        tone: '中立',
      },
      {
        title: '物流業界の労働力不足に関する特集記事',
        sourceType: '経済メディア',
        publishedAgoLabel: '18日前',
        summary: '業界全体のドライバー不足を特集する記事で、各社の対応状況の一つとして紹介された。',
        tone: '中立',
      },
      {
        title: '地方新拠点の稼働を開始',
        sourceType: '企業リリース',
        publishedAgoLabel: '25日前',
        summary: '配送リードタイム短縮を目的とした地方新拠点の稼働を開始したと発表。',
        tone: 'ポジティブ',
      },
    ],
  },
  {
    code: '2488',
    name: '太陽ファイナンシャルグループ株式会社',
    kana: 'タイヨウファイナンシャルグループ',
    market: 'プライム',
    sector: '金融(地域金融)',
    description: '地方を地盤とする金融持株会社の架空企業。銀行・リース・証券子会社を傘下に持つ。',
    basePrice: 5600,
    driftPctAnnual: 2,
    volPctAnnual: 16,
    fundamentals: {
      marketCapOku: 5100,
      per: 9.8,
      pbr: 0.6,
      roe: 6.4,
      dividendYieldPct: 3.8,
      revenueGrowthYoYPct: 4.1,
      opMarginPct: 0,
    },
    growthPoints: [
      '金利環境の変化により、貸出金利ざやが改善傾向。',
      '法人向けコンサルティング(事業承継・M&A仲介)手数料収入が拡大。',
      '本支店統廃合とデジタル化により、経費率(OHR)が改善。',
    ],
    riskFactors: [
      {
        title: '地域経済への依存',
        description: '地盤地域の人口減少・経済動向に業績が左右されやすい構造的な課題がある。',
        severity: '中',
      },
      {
        title: '有価証券運用リスク',
        description: '保有する債券・株式等の価格変動が決算に影響を与える可能性がある。',
        severity: '中',
      },
      {
        title: '信用コストの上昇リスク',
        description: '取引先企業の業況悪化により、貸倒引当金の積み増しが必要となる可能性。',
        severity: '低',
      },
    ],
    irSummary: {
      period: '2026年第1四半期(サンプル)',
      title: '貸出金利ざや改善と手数料収入拡大で増益',
      highlights: [
        '経常収益は前年同期比+4.1%',
        '法人コンサルティング関連手数料は前年同期比+13.5%',
        '経費率(OHR)は前年同期から改善',
      ],
      summary:
        '金利環境の変化を追い風に貸出金利ざやが改善。事業承継・M&A仲介など非金利収入も拡大し、増益基調を確保した。経営陣は株主還元強化についても言及している。',
    },
    managementComments: [
      {
        role: '代表取締役社長(決算説明会にて)',
        quote:
          '金利環境の変化は当グループにとって収益機会であり、法人向けソリューション提供と合わせて収益基盤を強化していく。',
        context: '四半期決算説明会での発言(要約・サンプル)',
      },
      {
        role: 'IR担当役員(株主総会にて)',
        quote:
          '資本効率の改善を意識し、配当性向の引き上げや自己株式取得を含めた株主還元策を検討している。',
        context: '定時株主総会での質疑応答(要約・サンプル)',
      },
    ],
    analystViews: [
      { rating: '強気', targetPrice: 6200, comment: '金利上昇局面での収益改善余地とPBRの割安さを評価。' },
      { rating: '中立', targetPrice: 5700, comment: '地域経済の動向次第で貸出需要が変動しうる点に留意。' },
      { rating: '強気', targetPrice: 6000, comment: '非金利収入の拡大が収益の安定性向上に寄与すると評価。' },
    ],
    news: [
      {
        title: '事業承継・M&A仲介の専門部署を新設',
        sourceType: '企業リリース',
        publishedAgoLabel: '4日前',
        summary: '地域の中小企業向けに事業承継支援を強化する専門部署を新設したと発表。',
        tone: 'ポジティブ',
      },
      {
        title: '本支店の統廃合計画を発表',
        sourceType: '経済メディア',
        publishedAgoLabel: '10日前',
        summary: 'デジタル化を背景に、一部支店の統廃合を進める計画を発表したと報じられた。',
        tone: '中立',
      },
      {
        title: '地域金融機関の金利ざや改善を分析する記事',
        sourceType: '経済メディア',
        publishedAgoLabel: '15日前',
        summary: '金利環境の変化が地域金融機関の収益に与える影響を分析する記事で、同社の名前が挙げられた。',
        tone: 'ポジティブ',
      },
      {
        title: '自己株式取得の実施を発表',
        sourceType: '企業リリース',
        publishedAgoLabel: '21日前',
        summary: '資本効率改善を目的とした自己株式取得の実施を発表。',
        tone: 'ポジティブ',
      },
    ],
  },
]

export function findCompany(codeOrName: string): Company | undefined {
  const query = codeOrName.trim()
  return companies.find(
    (c) => c.code === query || c.name === query,
  )
}

export function searchCompanies(query: string, limit = 8): Company[] {
  const q = query.trim().toLowerCase()
  if (!q) return companies.slice(0, limit)
  return companies
    .filter(
      (c) =>
        c.code.includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.kana.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q),
    )
    .slice(0, limit)
}
