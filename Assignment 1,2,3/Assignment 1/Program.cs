using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class code1 : MonoBehaviour
{
    float timeCounter = 0;
    float Rotation = 0;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        timeCounter += Time.deltaTime;
        float x = Mathf.Sin(timeCounter)* Mathf.Sin(timeCounter) * Mathf.Sin(timeCounter) * 16;
        float y = 0;
        float z = (Mathf.Cos(timeCounter)*13)-Mathf.Cos(timeCounter*2)*5- Mathf.Cos(timeCounter * 3) * 2-Mathf.Cos(timeCounter * 4);
        transform.position = new Vector3(x, y, z);
        

        if (Rotation==360)

        {
            Rotation = 0;
            //transform.Translate(0, 0, Time.deltaTime);
        }
        Rotation += 150 * Time.deltaTime;
        gameObject.transform.rotation = Quaternion.Euler(0, Rotation,0);
    }
}

