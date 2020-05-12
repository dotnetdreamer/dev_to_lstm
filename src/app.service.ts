import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as brain from 'brain.js';

@Injectable()
export class AppService {
  predict(description) {
    let data = JSON.parse(fs.readFileSync('./_ml/trained-net-category.json', 'utf8'));

    const network = new brain.recurrent.LSTM();
    network.fromJSON(data);

    const predictions = network.run<string>(description);
    return predictions;
  }

  build() {
    return this.trainExpenseCategoryMl();
  }

  async buildExpensesTrainingSet() {
    let data: any[] = JSON.parse(fs.readFileSync('./_data/expenses.json', 'utf8'));

    const trainingSet = data.map((e) => {
        const catName = e.category.name;
        const obj: brain.IRNNTrainingData = {
            input: e.description, 
            output: catName
        };
        return obj;
    });
    return trainingSet;
  }

  async trainExpenseCategoryMl() {
    // create configuration for training
    const config = {
      iterations: 100,
      log: true,
      logPeriod: 100,
      layers: [10],
      errorThresh: 0.00002,
    };
    
    const data = await this.buildExpensesTrainingSet();

    const network = new brain.recurrent.LSTM();
    network.train(data, config);

    const json = network.toJSON();
    const jsonStr = JSON.stringify(json);
    
    fs.writeFileSync(`_ml/trained-net-category.json`, jsonStr, 'utf8');
    return 'done';
  }
}
